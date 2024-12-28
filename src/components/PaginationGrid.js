import { Card, Grid2, Typography, CardMedia, CardContent, CardActions, Button, Container } from "@mui/material";

import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import useLocalStorage from "@/hook/useLocalStorage";

export default function PaginationGrid({ pokemonList, handleLearnMoreClick }) {
    const [favorites, setFavorites] = useLocalStorage('favorites', []);

    const handleFavoriteToggle = (pokemon) => {
        const isFavorite = favorites.some(fav => fav.name === pokemon.name);
        if (isFavorite) {
            setFavorites(favorites.filter(fav => fav.name !== pokemon.name));
        } else {
            setFavorites([...favorites, pokemon]);
        }
    };

    return (
        <Container>
            <Grid2 container spacing={2}>
                {pokemonList.map((pokemon, index) => {
                    const isFavorite = favorites.some(fav => fav.name === pokemon.name);
                    return (
                        <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 140, width: 140, objectFit: 'contain' }}
                                    image={pokemon.imageUrl}
                                    title={pokemon.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {pokemon.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleLearnMoreClick(pokemon.url)}>Learn More</Button>
                                    <Checkbox
                                        icon={<FavoriteBorder />}
                                        checkedIcon={<Favorite />}
                                        checked={isFavorite}
                                        onChange={() => handleFavoriteToggle(pokemon)}
                                    />
                                </CardActions>
                            </Card>
                        </Grid2>
                    );
                })}
            </Grid2>
        </Container>
    );
}
