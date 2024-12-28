import { Card, Typography, CardMedia, CardContent, CardActions, Button, Stack, Container, Pagination, Grid2 } from "@mui/material";

export default function PaginationGrid({ children, pokemonList, totalPokemonCount, limit, setOffset }) {
    return (
        <Container>
            <Stack spacing={2} alignItems="center">
                <Grid2 container spacing={2}>
                    {
                        pokemonList.map((pokemon, index) => (
                            <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 140, objectFit: 'contain' }}
                                        image={pokemon.imageUrl}
                                        title={pokemon.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {pokemon.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Grid2>
                        ))
                    }
                </Grid2>
                <Pagination count={Math.ceil(totalPokemonCount / limit)} variant="outlined" shape="rounded" color="primary" onChange={(e, page) => setOffset((page - 1) * limit)} />
            </Stack>
        </Container>
    );
}