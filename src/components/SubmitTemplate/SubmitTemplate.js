/**
 * Created by hanwencheng on 1/22/16.
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import uiStyles from '../../theme/uiStyles';
import {onContactOpen, onContactClose, onStartEdit, onChangeSearchValue} from "redux/modules/entity";
import {onSetError} from 'redux/modules/error';
import {Carousel, Map} from 'components';
import {RaisedButton, FlatButton, FontIcon, Paper, Dialog, Card, CardActions,
  CardHeader, CardMedia, CardTitle, CardText, List, ListItem, Divider, TextField} from 'material-ui';
import {capitalizeFirstLetter} from '../../utils/help';
import strings from '../../constant/strings';
var config = require('../../config');

@connect(
  state => ({
    contactOpen : state.entity.contactOpen,
    cachedImages : state.entity.cachedImages,
    user : state.auth.user,
    searchValue : state.entity.searchValue,
  }),
  {onContactOpen, onContactClose, onStartEdit, onChangeSearchValue, onSetError}
)
export default class SubmitTemplate extends Component {
  static propTypes = {
    entity: PropTypes.object,
    contactOpen : PropTypes.bool,
    cachedImages: PropTypes.array,
    user : PropTypes.object,
    searchValue :PropTypes.string,

    onSetError : PropTypes.func.isRequired,
    onContactOpen : PropTypes.func.isRequired,
    onContactClose : PropTypes.func.isRequired,
    onStartEdit : PropTypes.func.isRequired,
    onChangeSearchValue : PropTypes.func.isRequired,

    nextSlide :PropTypes.func,
    previousSlide : PropTypes.func,
  }

  render() {
    const styles = require('./SubmitTemplate.scss');
    const {entity, contactOpen, cachedImages, user, searchValue} = this.props;

    var Decorators = [
      {component: React.createClass({render() {
        return (
          <div className={styles.arrowContainer1} onClick={this.props.previousSlide}>
            <i className={styles.arrowIcon + " fa fa-angle-left fa-2x"}/>
          </div>)}
      }),
        position: 'CenterLeft', style: {height: "100%"}},
      {component: React.createClass({render() {
        return (
          <div className={styles.arrowContainer1} onClick={this.props.nextSlide}>
            <i className={styles.arrowIcon + " fa fa-angle-right fa-2x"}/>
          </div>)}
      }),
        position: 'CenterRight', style: {height: "100%"}},
    ];

    const onContactClick = (event) => {
      if(user){
        this.props.onContactOpen()
      }else{
        this.props.onSetError(strings.requireLoginError);
      }
    }

    const formatDate = (dateString) =>
    {
      const date = new Date(dateString)
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return year + "." + month + "." + day
      //return day + '/' + month + '/' + year;
    }

    const containerClass = this.props.user ? styles.container : styles.containerBeforeLogin;

    /** ==============only use for developing===============*/
    var weiboObject = () => {
      console.log('start get weibo object')
      if(entity.description){
        var descriptionArray = entity.description.split("&&")
        if(descriptionArray.length < 3) {
          return null;
        } else{
          var weiboName = descriptionArray[1]
          var weiboId = descriptionArray[2]
          var weiboLink = "http://www.weibo.com/p/" + weiboId

          console.log('now return right weibo object')
          return {name : weiboName, link : weiboLink, id : weiboId}
        }
      }else{
        return null;
      }
    }


    const renderWeiboName = () => {
      if(entity.description){
        var descriptionArray = entity.description.split("&&")
        if(descriptionArray.length < 3){
          return entity.description
        }else{
          var originalText = descriptionArray[0]
          var weiboName = descriptionArray[1]
          var weiboId = descriptionArray[2]
          var weiboLink = "http://www.weibo.com/p/" + weiboId

          return <span>
                  {originalText}<span><i className="fa fa-weibo"/><a href={weiboLink} target="_blank">{weiboName}</a></span>
                </span>
        }
      }else{
        return ""
      }
    }

    /** ==============End===============*/

    return (
      <div className={containerClass}>
        <div className={styles.card}>

          <div className={styles.cardMedia}>
            <div className={styles.cardPhoto}>
              <Carousel className={styles.carousel} decorators={Decorators} framePadding="32px" width="100%" slidesToShow={1}>
                {entity.images.length >= 1 && entity.images.map(address => (<div className={styles.imageContainer}><img src={address}/></div>))}
                {cachedImages.length >= 1 && cachedImages.map(file => <div className={styles.imageContainer}><img src={window.URL.createObjectURL(file)}/></div>)}
                {entity.images.length == 0 && cachedImages.length == 0 &&  <div className={styles.imageContainer}><img src={config.noImagePath}/></div>}
              </Carousel>
            </div>

            <div className={styles.cardTitle}>
              <div className={styles.cardTitleTitle}>{entity.name ? entity.name : ""}</div>
              <div className={styles.cardTitleUsername}>by {entity.username ? entity.username : ""}</div>
            </div>

            <div className={styles.cardText}>
              {renderWeiboName()}
            </div>


            <div className={styles.cardActions}>
              <div className={styles.contactHost}>
                <FlatButton style={uiStyles.actionButton} onClick={onContactClick}><span className="fa fa-envelope"/> 联系厂家</FlatButton>
              </div>
            </div>
          </div>

          { entity.lat && entity.lng &&
            <div className={styles.mapContainer}>
              {/*<div className={styles.searchBar}>
                <div className={styles.searchInput}>
                  <TextField hintText="查询距离" value={searchValue}
                             onChange={(event) => {
                             //can't show value here
                    console.log('event is', event, 'value is', event.target)
                    this.props.onChangeSearchValue(value);
                  }}/>
                </div>
                <div className={styles.searchButton}>
                <RaisedButton label="确定" onClick={handleSearchButtonClick}/>
                </div>
              </div>*/}
              <div className={styles.map}>
                <Map geometry={[entity.lat, entity.lng]}/>
              </div>
            </div>
          }
        </div>
        <div className={styles.list}>
          <div className={styles.innerList}>
            <div className={styles.rowContainer}><i className="fa fa-copyright"/> 品牌 : &nbsp;&nbsp;  {entity.brand ? capitalizeFirstLetter(entity.brand) : ""}</div>
            <div className={styles.rowContainer}><i className="fa fa-industry"/>产品批次 : &nbsp;&nbsp;  {entity.batch_number ?  entity.batch_number : ""}</div>
            <div className={styles.rowContainer}><i className="fa fa-cubes"/> 本批产量 : &nbsp;&nbsp;  {entity.total_number ?  entity.total_number : ""}</div>
            <div className={styles.rowContainer}><i className="fa fa-link"/> 网页 : &nbsp;&nbsp;  {entity.address ? entity.address : "未指定"} </div>
            <div className={styles.rowContainer}><i className="fa fa-calendar"/> 生产日期 : &nbsp;&nbsp; {formatDate(entity.production_date)} </div>
            {entity.endDate &&
            <div className={styles.rowContainer}><i className="fa fa-calendar"/> 有效日期 :&nbsp;{formatDate(entity.expiration_date)}</div>}
            {user && user._id && user._id == entity.owner &&
            <RaisedButton style={uiStyles.buttonStyleEdit} key={12} className={styles.editButton} onClick={this.props.onStartEdit}><span
              className="fa fa-pencil"/> 编辑</RaisedButton>
            }
          </div>
        </div>

        <div className={styles.dialog}>
          <Dialog
            actions={
                  <div>
                    <FlatButton onClick={this.props.onContactClose} className={styles.hvrBuzzOut}>
                      <span className="fa fa-child"/>
                      <span>  </span>OK
                    </FlatButton>
                  </div>
                  }

            modal={false}
            open={contactOpen}
            onRequestClose={this.props.onContactClose}
          >
            <div className={styles.contactInfo}>
              <div className={styles.infoTitle}> {entity.brand ? entity.brand : ""}的联系方式:</div>
              <div className={styles.infoListMail}> <i className="fa fa-envelope-o" />  邮箱: &nbsp; {entity.email ? entity.email : ""} </div>
              <div className={styles.infoListWechat}> <i className="fa fa-wechat" />  微信: &nbsp; {entity.wechat ? entity.wechat : ""} </div>
              <div className={styles.infoListPhone}> <i className="fa fa-phone" />  电话: &nbsp; {entity.phone ? entity.phone : ""} </div>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}


