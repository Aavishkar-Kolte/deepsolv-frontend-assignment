"use client";
import { useState, useEffect } from 'react';
import { Card, Container, Grid2, Pagination, PaginationItem, Typography, CardMedia, CardContent, CardActions, Button, Stack } from "@mui/material";


export default function Home() {
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
      const response = await fetch(url);
      const data = await response.json();
      setTotalPokemonCount(data.count);

      const updatedPokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonDetailsResponse = await fetch(pokemon.url);
          const pokemonDetails = await pokemonDetailsResponse.json();
          return {
            ...pokemon,
            imageUrl: pokemonDetails.sprites.front_default,
          };
        })
      );

      setPokemonList(updatedPokemonList);
      setLoading(false);
    };

    fetchPokemonData();
  }, [offset, limit]);

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Pokemon Cards</Typography>
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
        </Stack>
      </Container>
    </>
  );
}
