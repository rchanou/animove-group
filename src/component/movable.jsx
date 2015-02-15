import React from 'react/addons';
import clone from 'clone';


export default class Movable extends React.Component {

  static defaultProps = { element: 'div' };

  state = { animating: false };

  render(){
    let { element, children, ...otherProps } = this.props;

    var newProps = clone(otherProps);

    newProps.ref = 'me';
    newProps.style.visibility = 'hidden';
    delete newProps.style.transition;
    delete newProps.style.WebkitTransition;

    return React.createElement(element, newProps, children);
  }

  componentDidMount(){
    var node = this.refs.me.getDOMNode();
    var parent = node.parentElement;

    var eventNode = document.createElement(this.props.element);
    parent.appendChild(eventNode);

    this.moveMover = () => {

      var rect = node.getBoundingClientRect();
      var parentRect = parent.getBoundingClientRect();
      console.log('this is happening', rect.top, rect.left, parentRect.top, parentRect.left);
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;

      let { element, children, ...otherProps } = this.props;

      var eventComponentProps = clone(otherProps);

      eventComponentProps.style.position = 'absolute';
      eventComponentProps.style.top = top;
      eventComponentProps.style.left = left;

      var eventComponent = React.createElement(
        element, eventComponentProps, children
      );

      React.render(eventComponent, eventNode);
    };
    this.moveMover();
  }

  componentDidUpdate(){
    this.moveMover();
  }
};
