import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class About extends Component {

  state = {
    showKitten: false
  }

/*<a href="http://hanwencheng.com">程翰文</a>和<a href="http://janeschara.tumblr.com">杨鑫玥</a>*/
  render() {
    const {showKitten} = this.state;
    const styles = require('./About.scss');
    return (
      <div className={styles.container}>
        <Helmet title="About"/>
        <div className={styles.text}>
          <div>
            <p className={styles.cnText}>Aeria game center is a center for interesting stuff!
            </p>
          </div>
          <div>
             <p className={styles.cnText}>Ever played with Dawn of Gods?</p>
          </div>
          <div className={styles.enText}>
            <p>
            This web page is created for Aeria Games in order to show something which could show front-end developing
              capability.
          </p>
          </div>
        </div>
      </div>
    );
  }
}
