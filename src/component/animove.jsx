/*
  The Gist of How This Works (figure out the rest):

  Children passed in are not directly rendered.

  Rather, on mount, invisible base children are derived from the actual children.

  Then, absolutely-positioned mover children are mounted and set to the
  calculated positions of their respective invisible buddies.

  Every time new props/children are passed in and the invisible children
  change, the positions of the mover children are set to the calculated
  positions of the invisible children.

  If the child elements have appropriate CSS transition properties set the usual
  ways (inline, by class, whatever), the movements will be animated!

  (insert KONY joke about invisible children)
 */

import React from 'react/addons';
import { chan, go, put, take, CLOSED } from 'js-csp';
import _ from 'lodash';

import Z from './lazy-tag.jsx';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var allKids = [];

    React.Children.forEach(this.props.children, kid => {
      var baseProps;
      if (kid.props){
        baseProps = _.cloneDeep(kid.props);
      } else {
        baseProps = { children: kid };
      }
      baseProps.key = (kid.key || kid);
      baseProps.ref = (kid.key || kid);

      if (!baseProps.style){
        baseProps.style = {};
      }
      baseProps.style.visibility = 'hidden';

      var baseKid = React.createElement(
        kid.type || 'span', baseProps, kid.props.children
      );

      allKids.push(baseKid);
    });

    for (var mover of this.state.movers){
      let { children, ...moverProps } = mover.props;

      var moverKid = React.createElement(
        mover.type,
        moverProps,
        children
      );

      moverKid = <Z t={mover.type} {...moverProps}>
        {children}
      </Z>;

      allKids.push(moverKid);
    }

    return React.createElement(
      tagName, otherProps, allKids
    );
  }

  calcMovers(){
    var movers = [];

    React.Children.forEach(this.props.children, kid => {
      var props;
      if (kid.props){
        props = _.cloneDeep(kid.props);
      } else {
        props = { children: kid };
      }
      props.key = (kid.key || kid) + 'MOVER';
      props.ref = props.key;

      if (!props.style){
        props.style = {};
      }

      var base = this.refs[kid.key || kid].getDOMNode();
      var rect = base.getBoundingClientRect();
      var parentRect = base.parentElement.parentElement.getBoundingClientRect();

      props.style.position = 'absolute';
      props.style.top = rect.top - parentRect.top;
      props.style.left = rect.left - parentRect.left;

      movers.push( { type: kid.type || 'span', props } );
    }.bind(this));

    // always sort the mover elements by key so as not to confuse React
    // the absolute positioning is what makes them show in the correct order
    return _.sortBy(movers, mover => mover.props.key);
  }

  setMovers(){
    this.setState({ movers: this.calcMovers() });
  }

  componentDidMount(){


    this.chanKeys = [
      'receiveProps', 'killEnd', 'moveEnd', 'addEnd'
    ];

    for (var key of this.chanKeys){
      this[key] = chan();
    }

    go(function* (){
      var e, keys, prevKeys, movers, prevMovers;

      while (e !== CLOSED){
        e = yield this.receiveProps;
        if (e === CLOSED) return;

        var kidKeys = [];
        React.Children.forEach(this.props.children, kid => {
          kidKeys.push(kid.key || kid);
        });

        //var deadKeys = _.filter(prevKeys, key => !_.contains(kidKeys, key));
        var deadMovers = _.filter(
          this.state.movers,
          mover => !_.contains(kidKeys, mover.props.key)
        );
        var killKidEnd = chan();
        for (var mover of deadMovers){
          this.refs[mover.props.ref].getDOMNode().addEventListener('transitionend', () => {
            go(function* (){
              yield put(killKidEnd);
            });
          });
          mover.props.style.opacity = 0;
        }
        var deadKidCount = 0;
        while (deadKidCount < deadMovers.length){
          yield killKidEnd;
          deadKidCount++;
        }


        e = yield this.killEnd;
        if (e === CLOSED) return;


        e = yield this.moveEnd;
        if (e === CLOSED) return;



        var newKeys = _.filter(kidKeys, key => !_.contains(prevKeys, key));



        yield put(this.addStart, newKeys);
        e = yield this.addEnd;
        if (e === CLOSED) return;

        prevKeys = kidKeys;
        prevMovers = movers;
      }
    }.bind(this));

    //this.setMovers();
  }

  // this.receivingProps flag short-circuits componentDidUpdate after movers are
  // updated, preventing circular setState -> componentDidUpdate -> setState...

  componentWillReceiveProps(nextProps){
    go(function* (){
      yield put(this.receiveProps);
    }.bind(this));

    //this.receivingProps = true;
  }

  componentDidUpdate(prevProps, prevState){
    /*if (!this.receivingProps){
      return;
    }

    this.receivingProps = false;

    this.setMovers();*/
  }

  componentWillUnmount(){
    for (var key of this.chanKeys){
      this[key].close();
    }
  }

};
