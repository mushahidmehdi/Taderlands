import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import somethingWrong from 'assests/errors/something-wrong.svg';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('error: ', error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('errorInfo: ', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryWrapper>
          {/* <div>
            <Image src={Logo} alt="something Went Wrong" />
          </div> */}
          <div>
            <img src={somethingWrong} alt="something Went Wrong" />
          </div>
          <h2>Ah! Something went wrong.</h2>
          <p>Brace yourself till we get the error fixed.</p>
          <span>You may also refresh the page or try again latter</span>
        </ErrorBoundaryWrapper>
      );
    } else {
      return this.props.children;
    }
  }
}

export default AppErrorBoundary;

AppErrorBoundary.propTypes = {
  children: PropTypes.node,
};

const ErrorBoundaryWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  text-align: center;
  padding-top: 4rem;

  > h2 {
    font-size: 1.3rem;
    margin-top: 1rem;
  }

  > p {
    margin-top: 0.8rem;
    font-size: 1.1rem;
  }
  > span {
    font-size: 1rem;
  }
`;
