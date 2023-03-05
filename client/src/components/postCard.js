import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import Grid from '@mui/material/Grid';
import { Button, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const PostCard = ({post: {id, body, createdAt, username, comments, likes, likeCount } }) => {
    const [isLiked, setIsLiked] = React.useState(false);
    const handleLike = () => {
      setIsLiked(!isLiked);
    }

    const user = useSelector(state => state.auth.loginResponse);

  return (
    <Grid item xs={4}>
        <Card sx={{ mb: 3 }} key={id}>
            <CardHeader
            avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {username.charAt(0).toUpperCase()}
                </Avatar>
            }
            action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            }
            title={username}
            subheader={<Link to={`/posts/${id}`} className='linkDecoration'>{moment(createdAt).fromNow(true)}</Link>}
            />
            <CardContent>
            <Typography variant="body2" color="text.secondary">
                {body}
            </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button as={Link} to={`/posts/${id}`} labelPosition='right'>
                    <Button color='blue' basic>
                        <Icon name={comments.length > 0 ? "comments" : "comment"} />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                        {comments.length}
                    </Label>
                </Button>
                {user && user.username === username && <DeleteButton postId={id} />}
            </CardActions>
        </Card>
    </Grid>
  )
}

export default PostCard