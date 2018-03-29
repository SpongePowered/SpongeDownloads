export default {
  name: 'build-label',
  props: {
    l: Object
  },
  render(create) {
    return create(this.l.link ? 'a' : 'span', {
      class: ['label', `label-${this.l.color}`],
      attrs: {
        title: this.l.title,
        href: this.l.link,
        target: this.l.link && '_blank'
      }
    }, this.l.name)
  }
}
