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
import clone from 'clone';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var allKids = [];

    React.Children.forEach(this.props.children, kid => {
      var baseProps;
      if (kid.props){
        baseProps = clone(kid.props);
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

      allKids.push(moverKid);
    }

    return React.createElement(
      tagName, otherProps, allKids
    );
  }

  setMovers(){
    var movers = [];

    React.Children.forEach(this.props.children, kid => {
      var props;
      if (kid.props){
        props = clone(kid.props);
      } else {
        props = { children: kid };
      }
      props.key = (kid.key || kid) + 'MOVER';

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
    movers.sort((a, b) => { // native JS's ugly mutative sort FTW
      if (a.props.key < b.props.key){
        return -1;
      } else {
        return 1;
      }
    });

    this.setState({ movers });
  }

  componentDidMount(){
    this.setMovers();
  }

  // this.receivingProps flag short-circuits componentDidUpdate after movers are
  // updated, preventing circular setState -> componentDidUpdate -> setState...

  componentWillReceiveProps(){
    this.receivingProps = true;
  }

  componentDidUpdate(prevProps, prevState){
    if (!this.receivingProps){
      return;
    }

    this.receivingProps = false;

    this.setMovers();
  }

};
