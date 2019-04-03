import React, { Component } from 'react';

const respond = (Cmp, width = 768) => {
  class ResponsiveDecorator extends Component {
    constructor(props) {
      super(props);

      this.state = {
        expand: document.body.clientWidth > width,
      };

      this.responsiveHandler = (e) => {
        if (e.matches) {
          this.setState({
            expand: false,
          });
        } else {
          this.setState({
            expand: true,
          });
        }
      };
    }

    componentDidMount() {
      // this.getValues((value) => {
      //   this.props.initSearchParams && this.props.initSearchParams(value)
      // })
      this.mql = window.matchMedia(`(max-width: ${width}px)`);
      this.mql.addListener(this.responsiveHandler);
    }

    componentWillUnmount() {
      this.mql && this.mql.removeListener(this.responsiveHandler);
    }

    render() {
      return <Cmp {...this.props} {...this.state} />;
    }
  }
  return ResponsiveDecorator;
};

export default respond;
