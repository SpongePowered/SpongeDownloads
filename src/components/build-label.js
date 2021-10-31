export default {
  name: 'build-label',
  props: {
    tagKey: String,
    text: String,
    color: String
  },
  render(create) {
    const k = this.tagKey;
    const t = k !== undefined ? `${k}: ${this.text}` : this.text;
    const color = this.color;
    return create('span', {
      class: ['badge', `badge-${color}`]
    }, t);
  }
}
