import React from 'react/addons';
import objectAssign from 'object-assign';

class Mover extends React.Component {

  render(){

  }

  componentDidUpdate(){

  }

}

export default class Movable extends React.Component {

  static defaultProps = { element: 'div' };

  state = { animating: false };

  render(){
    let { element, children, ...otherProps } = this.props;

    var newProps = objectAssign({}, otherProps);

    newProps.ref = 'me';

    if (this.state.animating){
      newProps.style.visibility = 'hidden';
    } else {
      newProps.style.visibility = '';
    }

    return React.createElement(element, newProps, children);
  }

  componentDidMount(){
    var node = this.refs.me.getDOMNode();

    var top, left;

    var changeObserver = new MutationObserver(e => {
      if (!this.state.animating){
        console.log('unmount');
        React.unmountComponentAtNode(this.moverNode);
        return;
      }

      console.log('dom change', e);

      var rect = node.getBoundingClientRect();
      var newTop = rect.top + document.documentElement.scrollTop;
      var newLeft = rect.left + document.documentElement.scrollLeft;

      if (newTop === top && newLeft === left){
        top = newTop;
        left = newLeft;
        this.setState({ animating: false });
        return;
      }
      top = newTop;
      left = newLeft;

      let { element, children, ...otherProps } = this.props;

      var moverProps = objectAssign({}, otherProps);

      moverProps.style.position = 'absolute';
      moverProps.style.top = top;
      moverProps.style.left = left;
      moverProps.style.visibility = '';
      moverProps.onTransitionEnd = e => {
        this.setState({ animating: false });
      }.bind(this);

      var mover = React.createElement(element, moverProps, children);

      if (!this.moverNode){
        this.moverNode = document.createElement('div');
        document.body.appendChild(this.moverNode);
      }

      React.render(mover, this.moverNode);
    }.bind(this));

    changeObserver.observe(node, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['style']
    });

    /*
    var node = this.refs.me.getDOMNode();

    var clearmoverNode = () => {
      try {
        document.body.removeChild(this.moverNode);
      } catch(ex){}

      delete this.moverNode;
    }.bind(this);

    var handleMoveEnd = e => {
      if (this.moverNode){
        clearmoverNode();
      }

      this.setState({ animating: false });
    }.bind(this);

    node.addEventListener('webkitTransitionEnd', handleMoveEnd);
    node.addEventListener('transitionend', handleMoveEnd);

    var changeObserver = new MutationObserver(e => {
      console.log('dom change', e);

      if (!this.state.animating){

        return;
      }

      if (this.moverNode){
        var rect = node.getBoundingClientRect();
        var top = rect.top + document.documentElement.scrollTop;
        var left = rect.left + document.documentElement.scrollLeft;

        if (this.state.animating
            && (this.moverNode.style.top === top + 'px')
            && (this.moverNode.style.left === left + 'px')){
          clearmoverNode();
          this.setState({ animating: false });
        } else {
          this.moverNode.style.cssText = getComputedStyle(this.refs.me.getDOMNode()).cssText;
          this.moverNode.innerHTML = node.innerHTML;
          this.moverNode.style.visibility = '';
          this.moverNode.style.position = 'absolute';
          this.moverNode.style.top = top + 'px';
          this.moverNode.style.left = left + 'px';
          //this.moverNode.style.backgroundColor = node.style.backgroundColor;
        }
      }
    }.bind(this));

    changeObserver.observe(node, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['style']
    });
    */
  }

  componentWillReceiveProps(nextProps){

    this.setState({ animating: true });

    /*
    if (!this.moverNode){
      var thisNode = this.refs.me.getDOMNode();
      var rect = thisNode.getBoundingClientRect();
      var top = rect.top + document.documentElement.scrollTop;
      var left = rect.left + document.documentElement.scrollLeft;

      this.moverNode = document.createElement(thisNode.tagName);
      this.moverNode.style.cssText = getComputedStyle(thisNode).cssText;
      this.moverNode.style.position = 'absolute';
      this.moverNode.style.top = top + 'px';
      this.moverNode.style.left = left + 'px';
      document.body.appendChild(this.moverNode);

      console.log('receive props', this.moverNode.style);
    }

    this.setState({ animating: true });
    */
  }

  componentDidUpdate(){
    /*if (this.moverNode){
      var thisNode = this.refs.me.getDOMNode();
      var rect = thisNode.getBoundingClientRect();
      var top = rect.top + document.documentElement.scrollTop;
      var left = rect.left + document.documentElement.scrollLeft;

      if (this.state.animating
          && (this.moverNode.style.top === top + 'px')
          && (this.moverNode.style.left === left + 'px')){
        try {
          document.body.removeChild(this.moverNode);
        } catch(ex){}

        delete this.moverNode;

        this.setState({ animating: false });
      } else {
        //this.moverNode.style.cssText = getComputedStyle(thisNode).cssText;
        this.moverNode.innerHTML = thisNode.innerHTML;
        this.moverNode.style.visibility = '';
        this.moverNode.style.position = 'absolute';
        this.moverNode.style.top = top + 'px';
        this.moverNode.style.left = left + 'px';
        this.moverNode.style.backgroundColor = thisNode.style.backgroundColor;

        console.log('did update', this.moverNode.style);
      }
    }*/
  }

};
