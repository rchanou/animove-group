import React from 'react/addons';
import clone from 'clone';


export default class Movable extends React.Component {

  static defaultProps = { element: 'div' };

  state = { animating: false };

  render(){
    let { element, children, ...otherProps } = this.props;

    var newProps = clone(otherProps);
    newProps.ref = 'me';

    if (!newProps.style){
      newProps.style = {};
    }

    newProps.style.visibility = 'hidden';
    delete newProps.style.transition;
    delete newProps.style.WebkitTransition;
    delete newProps.style.transitionDuration;
    delete newProps.style.WebkitTransitionDuration;
    delete newProps.style.transitionDelay;
    delete newProps.style.WebkitTransitionDelay;

    return React.createElement(element, newProps, children);
  }

  componentDidMount(){
    var me = this.refs.me.getDOMNode();
    var parent = me.parentElement;

    var animatedNode = document.createElement(this.props.element);
    parent.appendChild(animatedNode);

    this.moveAnimatedComponent = () => {
      var rect = me.getBoundingClientRect();
      var parentRect = parent.getBoundingClientRect();
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;

      let { element, children, ...otherProps } = this.props;

      var newProps = clone(otherProps);
      if (!newProps.style){
        newProps.style = {};
      }
      newProps.style.position = 'absolute';
      newProps.style.top = top;
      newProps.style.left = left;

      var animatedComponent = React.createElement(
        element, newProps, children
      );

      React.render(animatedComponent, animatedNode);
    };

    this.moveAnimatedComponent();
  }

  componentDidUpdate(){
    this.moveAnimatedComponent();
  }
};
