import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client';


const LikeButton = ({ user, post: { id, likes, likeCount }}) => {

const [liked, setLiked] = React.useState(false);
const handleLike = () => {
    setLiked(!liked);
}

React.useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
        {likeButton}
        <Label basic color='teal' pointing='left'>
            {likes.length}
        </Label>
    </Button>
  )
}


const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton