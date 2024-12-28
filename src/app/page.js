"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Stack } from "@mui/material";
import PaginationGrid from "@/components/PaginationGrid";


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
          <PaginationGrid pokemonList={pokemonList} totalPokemonCount={totalPokemonCount} limit={limit} setOffset={setOffset} />
        </Stack>
      </Container>
    </>
  );
}
