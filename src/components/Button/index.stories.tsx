import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import Button, { Props } from './index';

export default {
  title: 'Button',
  component: Button,
  argTypes: {},
} as Meta;

const Template: Story<Props> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  variant: 'primary',
  children: 'Primary',
};
