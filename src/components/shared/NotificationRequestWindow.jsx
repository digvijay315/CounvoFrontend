import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Slide,
} from '@mui/material';
import {
    NotificationsActive,
    Close,
    Check,
    NotificationsOff,
} from '@mui/icons-material';

const NotificationRequestWindow = ({ open, onClose, onAccept, onDecline }) => {
    const [isHoveringAccept, setIsHoveringAccept] = useState(false);
    const [isHoveringDecline, setIsHoveringDecline] = useState(false);

    const handleAccept = () => {
        if (onAccept) onAccept();
        if (onClose) onClose();
    };

    const handleDecline = () => {
        if (onDecline) onDecline();
        if (onClose) onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Slide}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
                },
            }}
        >
            {/* Decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(202, 41, 41, 0.1)',
                    filter: 'blur(40px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(193, 57, 223, 0.08)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Close button */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    color: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1,
                    '&:hover': {
                        color: 'white',
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <Close />
            </IconButton>

            <DialogContent
                sx={{
                    textAlign: 'center',
                    pt: 5,
                    pb: 3,
                    px: 4,
                    position: 'relative',
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(234, 184, 77, 0.2)',
                        backdropFilter: 'blur(10px)',
                        mb: 3,
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                transform: 'scale(1)',
                                boxShadow: '0 0 0 0 rgba(234, 184, 77, 0.4)',
                            },
                            '50%': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 0 20px 10px rgba(234, 184, 77, 0)',
                            },
                        },
                    }}
                >
                    <NotificationsActive
                        sx={{
                            fontSize: 40,
                            color: 'rgb(237, 196, 108)',
                            animation: 'ring 2s ease-in-out infinite',
                            '@keyframes ring': {
                                '0%, 100%': { transform: 'rotate(0deg)' },
                                '10%, 30%': { transform: 'rotate(-10deg)' },
                                '20%, 40%': { transform: 'rotate(10deg)' },
                                '50%': { transform: 'rotate(0deg)' },
                            },
                        }}
                    />
                </Box>

                {/* Title */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        letterSpacing: '-0.5px',
                    }}
                >
                    Enable Notifications?
                </Typography>

                {/* Description */}
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.6,
                        mb: 1,
                    }}
                >
                    Stay updated with important alerts and messages. We'll only send you
                    notifications that matter.
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 4,
                    pb: 4,
                    pt: 0,
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                {/* Decline Button */}
                <Button
                    onClick={handleDecline}
                    onMouseEnter={() => setIsHoveringDecline(true)}
                    onMouseLeave={() => setIsHoveringDecline(false)}
                    startIcon={<NotificationsOff />}
                    fullWidth
                    sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#676767',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    Not Now
                </Button>

                {/* Accept Button */}
                <Button
                    onClick={handleAccept}
                    onMouseEnter={() => setIsHoveringAccept(true)}
                    onMouseLeave={() => setIsHoveringAccept(false)}
                    startIcon={<Check />}
                    fullWidth
                    sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'white',
                        background: '#f0ba3b',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: '#dda31b',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                        },
                    }}
                >
                    Enable Notifications
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotificationRequestWindow;