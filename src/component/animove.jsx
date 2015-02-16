import React from 'react/addons';
import clone from 'clone';


class Watcher extends React.Component {

  render(){
    let { tagName, children, ...props } = this.props;
    return React.createElement(
      tagName, props, children
    );
  }

  componentWillMount(){
    console.log('mounting');
  }

  componentDidUpdate(){
    console.log('updating');
  }

  componentWillUnmount(){
    console.log('unmounting');
  }

}


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var kids = [];

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

      var newKid = React.createElement(
        kid.type || 'span', baseProps, kid.props.children
      );

      /*var newKid = <Watcher tagName={kid.type || 'span'} {...baseProps}>
        {kid.props.children}
      </Watcher>;*/

      kids.push(newKid);
    });

    for (var mover of this.state.movers){
      let { children, ...moverProps } = mover.props;

      var newKid = React.createElement(
        mover.type,
        moverProps,
        children
      );

      /*var newKid = <Watcher tagName={mover.type} {...moverProps}>
        {children}
      </Watcher>;*/

      kids.push(newKid);
    }

    return React.createElement(
      tagName, otherProps, kids
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
      props.key = (kid.key || kid) + 'mover';

      if (!props.style){
        props.style = {};
      }

      var base = this.refs[kid.key || kid].getDOMNode();
      //var base = React.findDOMNode(this.refs[kid.key || kid]);
      var rect = base.getBoundingClientRect();
      var parentRect = base.parentElement.parentElement.getBoundingClientRect();
      props.style.position = 'absolute';
      props.style.top = rect.top - parentRect.top;
      props.style.left = rect.left - parentRect.left;

      movers.push( { type: kid.type || 'span', props } );
    }.bind(this));

    movers.sort((a, b) => {
      if (a.props.key < b.props.key){
        return -1;
      } else {
        return 1;
      }
    });
    console.log('movers', movers);
    this.setState({ movers });
  }

  componentDidMount(){
    this.setMovers();
  }

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
