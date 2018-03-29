import IntlRelativeFormat from 'intl-relativeformat'

// Absolute date formatting
const absolute = new Intl.DateTimeFormat('en', {
  // Tuesday, March 27, 2018, 7:53 AM
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});

// Relative date formatting
const relative = new IntlRelativeFormat('en');

export default {
  name: 'relative-time',
  props: {
    t: String,
    tag: {
      type: String,
      default: 'span'
    }
  },
  render(create) {
    const d = new Date(this.t);
    return create(this.tag, {attrs: {title: absolute.format(d)}}, relative.format(d))
  }
}
