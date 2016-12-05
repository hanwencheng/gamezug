/**
 * Created by hanwencheng on 2/10/16.
 */
import React, {Component, PropTypes} from 'react';
import {GridList, GridTile, Dialog, IconButton, FlatButton} from 'material-ui';
import {Carousel} from 'components';
import { LinkContainer } from 'react-router-bootstrap';
import {onOpenDialog, onCloseDialog } from 'redux/modules/admin';
import {onStartEdit} from "redux/modules/entity";
import {onSetColumn} from 'redux/modules/entities';
import {capitalizeFirstLetter} from '../../utils/help';

import {connect} from 'react-redux';
import uiStyles from '../../theme/uiStyles'

var config = require('../../config');

@connect(
  state => ({
    popover : state.admin.popover,
    toDelete : state.admin.toDelete,
    column : state.entities.column,
    user: state.auth.user,
  }),
  {onOpenDialog, onCloseDialog, onStartEdit, onSetColumn}
)
export default class List extends Component {
  static propTypes = {
    products : PropTypes.array,
    popover : PropTypes.bool,
    toDelete : PropTypes.object,
    column : PropTypes.number,
    //from parent
    user : PropTypes.object,

    onDeleteHouse: PropTypes.func.isRequired,
    onOpenDialog : PropTypes.func.isRequired,
    onCloseDialog : PropTypes.func.isRequired,
    onStartEdit :PropTypes.func.isRequired,
    onSetColumn : PropTypes.func.isRequired,
  };

  handleResize = (event) => {
    if(window.innerWidth <= 600){
      if(this.props.column !== 1)
        //console.log( 'window inner width is', window.innerWidth, 'now set column to 1');
        this.props.onSetColumn(1)
    }else if(window.innerWidth <= 1200){
      if(this.props.column !== 2)
        //console.log( 'window inner width is', window.innerWidth, 'now set column to 2');
        this.props.onSetColumn(2)
    }else if(window.innerWidth <= 1800){
      if(this.props.column !== 3)
        //console.log( 'window inner width is', window.innerWidth, 'now set column to 3');
      this.props.onSetColumn(3)
    }else if(window.innerWidth <= 2400){
      if(this.props.column !== 4)
        //console.log( 'window inner width is', window.innerWidth, 'now set column to 4');
      this.props.onSetColumn(4)
    }
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render(){
    const margin = 3; //percent
    const marginPercentage = margin.toString() + "%"
    var tileWidth = (Math.floor(100 / this.props.column) - margin * 2).toString() + "%";
    const styles = require('./List.scss');
    const {onDeleteHouse, onOpenDialog, onCloseDialog, toDelete, column} = this.props;
    const products = this.props.entities;

    const deleteHouse = (event) => {
      onCloseDialog(event);
      if(toDelete){
        onDeleteHouse(this.props.user._id, toDelete.house._id, toDelete.index)
      }
    }

    const startEdit = (event) => {
      this.props.onStartEdit()
    }

    const saveIndex = (house, index, event) => {
      onOpenDialog(house, index)
    }

    const renderIcon = (house, index) => {
      const iconStyle = {"color" : "white"}
      if(this.props.user && house.owner === this.props.user._id){
        return(
          <span className={styles.buttonGroup}>
            <LinkContainer to={`/entities/${house._id}`}>
              <IconButton iconClassName="fa fa-pencil" onClick={startEdit} iconStyle={iconStyle}/>
            </LinkContainer>
            <IconButton iconClassName="fa fa-trash" onClick={saveIndex.bind(this, house, index)} iconStyle={iconStyle}/>
          </span>
        )
      }else{
        return
      }
    }

    //title={house.title}
    //subtitle={<span>by <b className={styles.usernameColor}>{house.username}</b> In
    //          <b className={styles.cityColor}> {house.city}</b></span>}

    const computeLayouts = (total) => {
      var layouts = {
        lg : computeLayout(total, 5),
        md : computeLayout(total, 3),
        sm : computeLayout(total, 2),
        xs : computeLayout(total, 1),
        xxs : computeLayout(total ,1 )
      }
      return layouts
    }

    const computeLayout = (total, divider)=>{
      var layout = [];
      for(var i = 0; i < total; i ++){
        var each = { x : i % divider, y : Math.floor(i / divider), w : 1, h: 1, i:i.toString()}
        console.log('for i = ' + i + " divider = " + divider + " each = " , each)
        layout.push(each)
      }
      return layout
    }

    return (
      <div className={styles.gridList}>
        <div className={styles.myList}>
          {products.map((product, index) => (
            <GridTile
              className={styles.tile}
              key={product._id}
              style={{
              "display" : "flex", "alignItems":"center", "justifyContent": "center",
               height: "300px", width : tileWidth, margin : marginPercentage}}
              title={product.name}
              subtitle={
                <span>
                  by <b className={styles.usernameColor}>{product.name}</b> In <b className={styles.cityColor}>
                  {product.brand}</b>
                </span>
              }
              actionIcon={renderIcon(product, index)}
            >
              <Carousel key={product._id} className={styles.carousel} width={"100%"}
                        initialSlideHight={300} initialSlideWidth={500}>
                { product.images && product.images.length ?
                  product.images.map((address, index) => (
                    <div key={index} className={styles.imageContainer}>
                      <LinkContainer to={`/entities/${product._id}`}>
                        <img key={index} src={address}/>
                      </LinkContainer>
                    </div>
                  ))
                  :
                  <div key={index} className={styles.imageContainer}>
                    <LinkContainer to={`/entities/${product._id}`}>
                      <img key={index} src={config.iconPath}/>
                    </LinkContainer>
                  </div>
                }
              </Carousel>
            </GridTile>
          ))
        }
        </div>
        <Dialog
          title="确认删除"
          actions={[
                <FlatButton
                  label="取消"
                  onClick={onCloseDialog}
                />,
                <FlatButton
                  label="删除"
                  onClick={deleteHouse}
                  labelStyle={uiStyles.dialogConfirmStyle}
                />,
              ]}
          modal={false}
          open={this.props.popover}
          onRequestClose={onCloseDialog}
        >
          确认要删除?
        </Dialog>
      </div>

    )
  }
}