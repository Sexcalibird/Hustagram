import moment from 'moment';

const TimeAgo = ({timestamp}) => {
    const timeAgo = moment(timestamp).fromNow();
    return <>{timeAgo}</>
}

export default TimeAgo