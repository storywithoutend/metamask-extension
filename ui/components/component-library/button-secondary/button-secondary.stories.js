import React from 'react';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  ALIGN_ITEMS,
  DISPLAY,
} from '../../../helpers/constants/design-system';
import Box from '../../ui/box/box';
import { ICON_NAMES } from '../icon';
import { ButtonSecondary, BUTTON_SECONDARY_SIZES } from './button-secondary';
import README from './README.mdx';

const marginSizeControlOptions = [
  undefined,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  'auto',
];

export default {
  title: 'Components/ComponentLibrary/ButtonSecondary',
  id: __filename,
  component: ButtonSecondary,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['button', 'a'],
      table: { category: 'button base props' },
    },
    block: {
      control: 'boolean',
      table: { category: 'button base props' },
    },
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'button base props' },
    },
    icon: {
      control: 'select',
      options: Object.values(ICON_NAMES),
      table: { category: 'button base props' },
    },
    loading: {
      control: 'boolean',
      table: { category: 'button base props' },
    },
    size: {
      control: 'select',
      options: Object.values(BUTTON_SECONDARY_SIZES),
    },
    type: {
      control: 'select',
      options: Object.values(BUTTON_TYPES),
    },
    display: {
      options: Object.values(DISPLAY),
      control: 'select',
      table: { category: 'box props' },
    },
    marginTop: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginRight: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginBottom: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
    marginLeft: {
      options: marginSizeControlOptions,
      control: 'select',
      table: { category: 'box props' },
    },
  },
  args: {
    children: 'Button Secondary',
  },
};

export const DefaultStory = (args) => (
  <>
    <ButtonSecondary {...args} />
  </>
);

DefaultStory.storyName = 'Default';

export const Size = (args) => (
  <Box display={DISPLAY.FLEX} alignItems={ALIGN_ITEMS.BASELINE} gap={1}>
    <ButtonSecondary {...args} size={BUTTON_SIZES.SM}>
      Small Button
    </ButtonSecondary>
    <ButtonSecondary {...args} size={BUTTON_SIZES.MD}>
      Medium (Default) Button
    </ButtonSecondary>
    <ButtonSecondary {...args} size={BUTTON_SIZES.LG}>
      Large Button
    </ButtonSecondary>
  </Box>
);

export const Type = (args) => (
  <Box display={DISPLAY.FLEX} gap={1}>
    <ButtonSecondary {...args} type={BUTTON_TYPES.NORMAL}>
      Normal
    </ButtonSecondary>
    {/* Test Anchor tag to match exactly as button */}
    <ButtonSecondary as="a" {...args} href="#" type={BUTTON_TYPES.DANGER}>
      Danger
    </ButtonSecondary>
  </Box>
);
