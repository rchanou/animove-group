import React from 'react/addons';
import objectAssign from 'object-assign';

export default class Movable extends React.Component {

  static defaultProps = { element: 'div' };

  state = { animating: false };

  render(){
    let { element, children, ...otherProps } = this.props;

    var newProps = objectAssign({}, otherProps);
    newProps.ref = 'me';
    if (this.state.animating){
      newProps.style.visibility = 'hidden';
    }

    return React.createElement(
      element,
      newProps,
      children
    );
  }

  componentDidMount(){
    var node = this.refs.me.getDOMNode();
    node.style.position = 'absolute';
    node.style.top = '200px';
    node.style.left = '200px';
    console.log(node.getBoundingClientRect(), document.documentElement.scrollTop, document.documentElement.scrollLeft, document);

    node.addEventListener('webkitTransitionEnd', e => {
      console.log('animation end');
      this.setState({ animating: false });
      if (this.movingNode){
        document.body.removeChild(this.movingNode);
        delete this.movingNode;
      }
    }.bind(this));

    /*
      setTimeout(() => {
        node.style.backgroundColor = 'red';
        node.style.top = '100px';
        node.style.left = '100px';
      }, 2000);

      setTimeout(() => {
          node.style.backgroundColor = 'blue';
          node.style.top = '200px';
          node.style.left = '200px';
      }, 3000);
    */
  }

  componentWillReceiveProps(nextProps){
    if (!this.movingNode){
      console.log('cloning');
      var thisNode = this.refs.me.getDOMNode();
      var rect = thisNode.getBoundingClientRect();
      var top = rect.top + document.documentElement.scrollTop;
      var left = rect.left + document.documentElement.scrollLeft;

      this.movingNode = thisNode.cloneNode(true);
      this.movingNode.style.position = 'absolute';
      this.movingNode.style.top = top + 'px';
      this.movingNode.style.left = left + 'px';

      document.body.appendChild(this.movingNode);
    }
  }

  componentDidUpdate(){

  }

};
