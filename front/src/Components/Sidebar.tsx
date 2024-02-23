import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Typography from '@mui/material/Typography';

const channels = [
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
    { name: 'auronplay', viewers: '82K', category: 'Grand Theft Auto V' },
];

const Sidebar = () => {
  return (
    <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
        <Typography 
            component="h2"
            variant="h9" // or the variant that matches your design
            align="center" // This centers the text
            color="white"
            gutterBottom // Adds margin to the bottom
        >
            TOP AUCTIONS
        </Typography>
        {channels.map((channel, index) => (
            <ListItem button key={index}>
                <ListItemAvatar>
                    <Avatar>
                    <StorefrontIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText 
                    primary={channel.name}
                    secondary={channel.viewers}
                    primaryTypographyProps={{ style: { color: 'white' } }}
                    secondaryTypographyProps={{ style: { color: 'gray' } }}
                />
            </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
