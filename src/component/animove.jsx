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
import { chan, go, put, take, buffers, CLOSED } from 'js-csp';
import _ from 'lodash';

import Z from './lazy-tag.jsx';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = {
    movers: [
      /*{ type: 'li', props: { key: '1MOVER' } },
      { type: 'li', props: { key: '2MOVER' } },
      { type: 'li', props: { key: '3MOVER' } },
      { type: 'li', props: { key: '4MOVER' } }*/
    ]
  };

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
      //console.log(base.style);
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

  componentDidMount(){
    this.chanKeys = [
      'receiveProps', 'transitionEnd'
    ];

    this.transitionEnd = chan();
    this.receiveProps = chan(); //chan(buffers.dropping(1));

    /*for (var key of this.chanKeys){
      this[key] = chan();
    }*/

    /*go(function* (){
      yield put(this.receiveProps);
    }.bind(this));*/

    this.setState({ movers: this.calcMovers() });

    go(function* (){
      var e;

      while (e !== CLOSED){
        e = yield this.receiveProps;
        if (e === CLOSED) return;

        var prevMovers = _.cloneDeep(this.state.movers);

        var baseKeys = [];
        React.Children.forEach(this.props.children, kid => {
          baseKeys.push((kid.key || kid) + 'MOVER');
        });
        var movers = _.cloneDeep(this.state.movers);

        var prevMoverKeys = [];

        // kill dead kids
        var deadMoverCount = 0;
        movers.forEach(mover => {
          prevMoverKeys.push(mover.props.key);
          if (!_.contains(baseKeys, mover.props.key)){
            deadMoverCount++;
            mover.props.style.opacity = 0;
          }
        });
        //console.log(baseKeys, movers);
        this.setState({ movers });

        var killCount = 0;
        while (killCount < deadMoverCount){
          //console.log('b4 kill');
          e = yield this.transitionEnd;
          //if (e === CLOSED) return;
          killCount++;
        }
        this.transitionEnd.close();
        this.transitionEnd = chan();

        //create/move living kids
        var shownCount = 0;
        var movers = [];
        React.Children.forEach(this.props.children, (kid, i) => {
          var props;
          if (kid.props){
            props = _.cloneDeep(kid.props);
          } else {
            props = { children: kid };
          }
          props.key = (kid.key || kid) + 'MOVER';
          props.onTransitionEnd = () => {
            go(function* (){
              yield put(this.transitionEnd, props.key);
              //console.log('transition end', props.key);
            }.bind(this));
          };

          if (!props.style){
            props.style = {};
          }

          var base = this.refs[kid.key || kid].getDOMNode();
          var rect = base.getBoundingClientRect();
          var parentRect = base.parentElement.parentElement.getBoundingClientRect();

          props.style.position = 'absolute';
          props.style.top = rect.top - parentRect.top;
          props.style.left = rect.left - parentRect.left;
          if (!_.contains(prevMoverKeys, props.key)){
            //console.log('opacity to 0');
            //console.log('new');
            props.style.opacity = 0;
          } else {
            var prev = _.find(prevMovers, mover => mover.props.key === props.key);
            //console.log(kid, prev);
            if (props.style.top !== prev.props.style.top || props.style.left !== prev.props.style.left){
              shownCount++;
            } else {
              //console.log('no change!');
            }
          }

          movers.push( { type: kid.type || 'span', props } );
        }.bind(this));
        //console.log(newMovers);
        // always sort the mover elements by key so as not to confuse React
        // the absolute positioning is what makes them show in the correct order
        movers = _.sortBy(movers, mover => mover.props.key);

        //console.log('will set state to', movers);
        this.setState({ movers });

        movers = _.cloneDeep(movers);

        var doneCount = 0;
        while (doneCount < shownCount){
          //console.log('b4 move');
          e = yield this.transitionEnd;
          //if (e === CLOSED) return;
          doneCount++;
          console.log(doneCount, shownCount);
        }
        this.transitionEnd.close();
        this.transitionEnd = chan();

        var newCount = 0;
        movers.forEach(mover => {
          //console.log('checking new', mover.props.key, prevMoverKeys);
          if (!_.contains(prevMoverKeys, mover.props.key)){
            newCount++;
            mover.props.style.opacity = 1;
            //delete mover.props.style.opacity;
          }
        });

        this.setState({ movers });

        var bornCount = 0;
        while (bornCount < newCount){
          //console.log('b4 add', bornCount, newCount);
          e = yield this.transitionEnd;
          //if (e === CLOSED) return;
          bornCount++;
          //console.log('made it here', bornCount, newCount);
        }
        this.transitionEnd.close();
        this.transitionEnd = chan();
        console.log('END OF CYCLE');
      }
    }.bind(this));
  }

  componentWillReceiveProps(nextProps){
    go(function* (){
      yield put(this.receiveProps);
    }.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    //console.log('updated', prevState.movers, this.state.movers);
    //console.log('updated', this.state.movers, this.props.children);
  }

  componentWillUnmount(){
    for (var key of this.chanKeys){
      this[key].close();
    }
  }

};
