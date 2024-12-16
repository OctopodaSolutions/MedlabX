import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './MainLayout.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, } from '@mui/material';
import columnImage from '../../../assets/filter.png';
import reportImage from  '../../../assets/report.jpg';
// import WasteManagerImage from '../../../assets/125555603-open-box-white-flat-simple-icon-with-shadow.jpg'
import { setTab } from '../../../redux_stores/actions';
import { useDispatch } from 'react-redux';



/**
 * The DashboardMenu component renders the main dashboard view with various cards.
 * @component
 * @param {Object} props - The properties for the component.
 * @example
 * return <DashboardMenu />;
 */
export function DashboardMenu(props) {
    return (
        <div>
            <Box
                sx={{ color: 'black', backgroundColor: 'black', width: '100%' }}
            >
                <Container className='dashboard_container' sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', height: '94vh' }}>
                    <McaCard />
                    <XCSM />
                </Container>
            </Box>
        </div>
    );
}

/**
 * The McaCard component displays a card with an image and title, and navigates to a specific route when clicked.
 * @component
 * @example
 * return <McaCard />;
 */
export function McaCard() {
    const navigate = useNavigate();

    /**
     * Handles the card click event to navigate to a different route.
     */
    const handleClick = () => {
        navigate('/nav');
    };

    return (
        <Card sx={{ maxWidth: 345, maxHeight: 245, marginLeft: 1, marginRight: 1, backgroundColor: 'black' }} elevation={10} onClick={handleClick}>
            <CardActionArea sx={{ backgroundColor: 'black' }}>
                <CardMedia component="img" height="140" sx={{ backgroundColor: 'black' }} image={columnImage} title="Dashboard" alt="MCA" />
                <CardContent sx={{ backgroundColor: 'black' }}>
                    <Typography gutterBottom variant="h6" component="div" color={'white'}>
                        MCA
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

/**
 * The XCSM component displays a card with an image and title, and navigates to a specific route when clicked.
 * @component
 * @example
 * return <XCSM />;
 */
export function XCSM() {
    const navigate = useNavigate();

    /**
     * Handles the card click event to navigate to a different route.
     */
    const handleClick = () => {
        navigate('/nav');
    };

    return (
        <Card sx={{ maxWidth: 345, maxHeight: 245, marginLeft: 1, marginRight: 1, backgroundColor: 'black' }} elevation={10} onClick={handleClick}>
            <CardActionArea sx={{ backgroundColor: 'black' }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={reportImage}
                    title="Dashboard"
                    alt="XCSM"
                />
                <CardContent sx={{ backgroundColor: 'black' }}>
                    <Typography gutterBottom variant="h6" component="div" color={'white'}>
                        XCSM
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

/**
 * The ControlCard component displays a card with an image and title, and dispatches an action to change the tab value and navigates to a specific route when clicked.
 * @component
 * @example
 * return <ControlCard />;
 */
export default function ControlCard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Handles the card click event to dispatch an action and navigate to a different route.
     */
    const handleClick = () => {
        dispatch(setTab(0));
        navigate('/nav');
    };

    return (
        <Card sx={{ maxWidth: 345, maxHeight: 245, marginLeft: 1, marginRight: 1 }} elevation={10} onClick={handleClick}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={columnImage}
                    title="Dashboard"
                    alt="Control Card"
                />
                <CardContent sx={{ backgroundColor: 'black' }}>
                    <Typography gutterBottom variant="h6" component="div" color={'white'}>
                        Program
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}


// export  function WasteManager() {

//     const navigate = useNavigate()

//     const handleClick = () => {
//         navigate('/nav');
//     };

//     return (
//         <Card sx={{ maxWidth: 345, maxHeight: 245, marginLeft: 1, marginRight: 1 }} elevation={10} onClick={handleClick}>
//             <CardActionArea>
//                 <CardMedia
//                     component="img"
//                     height="140"
//                     image={WasteManagerImage}
//                     title="waste manager"
//                     alt="green iguana"
//                 />
//                 <CardContent
//                 sx={{backgroundColor:'black'}}
//                 >
//                     <Typography gutterBottom variant="h6" component="div" color={'white'} >
//                         Waste Manager
//                     </Typography>
//                 </CardContent>
//             </CardActionArea>
//         </Card>
//     );
// }