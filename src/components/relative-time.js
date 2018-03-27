import moment from 'moment'

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
        const m = moment(this.t);
        return create(this.tag, {attrs:{title: m.local().format("LLL")}}, m.fromNow())
    }
}
