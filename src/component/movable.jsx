import React from 'react/addons';
import objectAssign from 'object-assign';


export default class Movable extends React.Component {

  static defaultProps = { element: 'div', transition: 'all ease-out 3s' };

  state = { animating: false };

  render(){
    let { element, children, ...otherProps } = this.props;

    var newProps = objectAssign({}, otherProps);

    newProps.ref = 'me';
    newProps.style.visibility = 'hidden';

    return React.createElement(element, newProps, children);
  }

  componentDidMount(){
    var node = this.refs.me.getDOMNode();
    node.setAttribute('id', 'a');
    var parent = node.parentElement;
    console.log('parent', parent);
    //this.moverNode = document.createElement(this.props.element);
    var eventNode = document.createElement(this.props.element);
    parent.appendChild(eventNode);

    this.moveMover = () => {

      var rect = node.getBoundingClientRect();
      var parentRect = parent.getBoundingClientRect();
      console.log('this is happening', rect.top, rect.left, parentRect.top, parentRect.left);
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;
      //var top = rect.top + document.documentElement.scrollTop;
      //var left = rect.left + document.documentElement.scrollLeft;

      /*
      this.moverNode.style.cssText = getComputedStyle(node, null).cssText;
      console.log('comp', getComputedStyle(node).cssText);
      this.moverNode.style.transition = this.props.transition;
      this.moverNode.style.WebkitTransition = this.props.transition;
      this.moverNode.innerHTML = node.innerHTML;
      this.moverNode.style.visibility = '';
      this.moverNode.style.position = 'absolute';
      this.moverNode.style.top = top + 'px';
      this.moverNode.style.left = left + 'px';
      */

      let { element, transition, children, ...otherProps } = this.props;
      var eventComponentProps = objectAssign({}, otherProps);
      eventComponentProps.style.transition = transition;
      eventComponentProps.style.position = 'absolute';
      eventComponentProps.style.top = top;
      eventComponentProps.style.left = left;
      eventComponentProps.style.visibility = '';
      console.log('event props', eventComponentProps);

      var eventComponent = React.createElement(
        element,
        eventComponentProps,
        children
      );

      React.render(eventComponent, eventNode);
    };
    this.moveMover();

    //parent.appendChild(this.moverNode);
    //document.body.appendChild(this.moverNode);
/*
    var changeObserver = new MutationObserver(e => {
      console.log('dom change', e);

      this.moveMover();


      let { element, children, ...otherProps } = this.props;

      var moverProps = objectAssign({}, otherProps);

      moverProps.style.position = 'absolute';
      moverProps.style.top = top;
      moverProps.style.left = left;
      moverProps.style.visibility = '';

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
    });*/
  }

  componentDidUpdate(){
    this.moveMover();
  }
};
