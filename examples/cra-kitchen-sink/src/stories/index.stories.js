import React from 'react';

import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { Button } from '@storybook/react/demo';
import PropTypes from 'prop-types';

import App from '../App';
import Container from './Container';
import LifecycleLogger from '../components/LifecycleLogger';

const InfoButton = () => (
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}
    Show Info{' '}
  </span>
);

storiesOf('Button', module)
  .addDecorator(withNotes)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      Hello Button
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ))
  .add(
    'with notes',
    () => (
      <Button>
        {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
        Check my notes in the notes panel
      </Button>
    ),
    { notes: 'A very simple button' }
  )
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context => (
      <Container>
        {setOptions({ selectedAddonPanel: 'storybook/info/info-panel' })}
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    ))
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      withNotes('Composition: Info(Notes())')(context => (
        <div>
          {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      ))
    )
  );

const now = new Date();
const IsFridayContext = React.createContext(now.getDay() === 5);

storiesOf('Context - no decorator', module).add(
  'with info with a consumer',
  withInfo('Is it Friday?')(() => (
    <IsFridayContext.Provider>
      <IsFridayContext.Consumer>
        {isFriday =>
          isFriday ? (
            <a href="https://www.youtube.com/watch?v=kfVsfOSbJY0">It's friday</a>
          ) : (
            "It's a miserable day"
          )
        }
      </IsFridayContext.Consumer>
    </IsFridayContext.Provider>
  ))
);
class DayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { day: now.getDay() };
    this.handleDayChange = this.handleDayChange.bind(this);
  }
  handleDayChange(e) {
    this.setState({ day: e.target.value });
  }
  render() {
    return (
      <div>
        <select value={this.state.day} onChange={this.handleDayChange}>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
            (name, index) => <option value={index}>{name}</option>
          )}
        </select>
        <IsFridayContext.Provider value={Number(this.state.day) === 5}>
          {React.Children.only(this.props.children)}
        </IsFridayContext.Provider>
      </div>
    );
  }
}
DayPicker.propTypes = {
  children: PropTypes.node.isRequired,
};
storiesOf('Context - decorator', module)
  .addDecorator(story => <DayPicker>{story()}</DayPicker>)
  .add(
    'with info with a consumer',
    withInfo('Is it Friday?')(() => (
      <IsFridayContext.Consumer>
        {isFriday =>
          isFriday ? (
            <a href="https://www.youtube.com/watch?v=kfVsfOSbJY0">It's friday</a>
          ) : (
            "It's a miserable day"
          )
        }
      </IsFridayContext.Consumer>
    ))
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Some really long story kind description', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('Lifecycle', module).add('logging', () => <LifecycleLogger />);
