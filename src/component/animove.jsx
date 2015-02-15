import React from 'react';
import clone from 'clone';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };



  render(){
    let { tagName, children, ...otherProps } = this.props;

    React.Children.map(this.props.children, child => {
      console.log(child);
    });

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

    return React.createElement(tagName, newProps, children);
  }

  componentDidMount(){
    var me = this.refs.me.getDOMNode();
    var parent = me.parentElement;//.parentElement;

    this.animatedNode = document.createElement(this.props.tagName);
    parent.appendChild(this.animatedNode);

    this.moveAnimatedComponent = () => {
      var rect = me.getBoundingClientRect();
      var parentRect = parent.parentElement.getBoundingClientRect();
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;

      let { tagName, children, ...otherProps } = this.props;

      var newProps = clone(otherProps);
      if (!newProps.style){
        newProps.style = {};
      }
      newProps.style.position = 'absolute';
      newProps.style.top = top;
      newProps.style.left = left;

      var animatedComponent = React.createElement(
        tagName, newProps, children
      );

      React.render(animatedComponent, this.animatedNode);
    };

    this.moveAnimatedComponent();
  }

  componentDidUpdate(){
    this.moveAnimatedComponent();
  }

  componentWillUnmount(){
    React.unmountComponentAtNode(this.animatedNode);
  }

};
