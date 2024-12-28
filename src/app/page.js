"use client";
import { useState, useEffect } from 'react';
import { Container, Typography, Stack, Select, MenuItem, FormControl, InputLabel, TextField, Pagination } from "@mui/material";
import PaginationGrid from "@/components/PaginationGrid";

export default function Home() {
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTypes = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      const data = await response.json();
      setTypes(data.results);
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchAllPokemon = async () => {
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

    if (!selectedType) {
      fetchAllPokemon();
    }
  }, [offset, limit, selectedType]);

  useEffect(() => {
    const fetchPokemonByType = async () => {
      setLoading(true);
      const url = `https://pokeapi.co/api/v2/type/${selectedType}`;
      const response = await fetch(url);
      const data = await response.json();
      setTotalPokemonCount(data.pokemon.length);

      const updatedPokemonList = await Promise.all(
        data.pokemon.map(async ({ pokemon }) => {
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

    if (selectedType) {
      fetchPokemonByType();
    }
  }, [selectedType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setOffset(0);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setOffset(0);
  };


  const handlePageChange = (event, value) => {
    setPage(value);
    setOffset((value - 1) * limit);
  };

  const totalPages = Math.ceil(totalPokemonCount / limit);

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Pokemon Cards</Typography>
          <Container>
            <Stack spacing={2} alignItems={"center"}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={selectedType} onChange={handleTypeChange}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {types.map((type) => (
                    <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Limit"
                type="number"
                value={limit}
                onChange={handleLimitChange}
                fullWidth
              />
              <PaginationGrid
                pokemonList={pokemonList}
                totalPokemonCount={totalPokemonCount}
                limit={limit}
                setOffset={setOffset}
                totalPages={totalPages}
              />
              <Pagination count={Math.ceil(totalPokemonCount / limit)} variant="outlined" shape="rounded" color="primary" page={page} onChange={handlePageChange} />
            </Stack>
          </Container>
        </Stack >
      </Container >
    </>
  );
}
