"use client";
import { useState, useEffect } from 'react';
import { Container, Pagination, Typography, Stack, TextField, Select, MenuItem, FormControl, InputLabel, Drawer, Box, CircularProgress } from "@mui/material";
import PaginationGrid from '@/components/PaginationGrid';

export default function Home() {
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      const data = await response.json();
      setTypes(data.results);
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
      if (selectedType) {
        url = `https://pokeapi.co/api/v2/type/${selectedType}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (selectedType) {
        const updatedPokemonList = await Promise.all(
          data.pokemon.map(async ({ pokemon }) => {
            const pokemonDetailsResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonDetailsResponse.json();
            return {
              ...pokemon,
              imageUrl: pokemonDetails.sprites.front_default,
              url: pokemon.url
            };
          })
        );

        setTotalPokemonCount(updatedPokemonList.length);
        setPokemonList(updatedPokemonList.slice(offset, offset + limit));
      } else {
        const updatedPokemonList = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonDetailsResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonDetailsResponse.json();
            return {
              ...pokemon,
              imageUrl: pokemonDetails.sprites.front_default,
              url: pokemon.url
            };
          })
        );

        setTotalPokemonCount(data.count);
        setPokemonList(updatedPokemonList);
      }

      setLoading(false);
    };

    fetchPokemonData();
  }, [offset, limit, selectedType]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setOffset(0);
  };

  const handleLearnMoreClick = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    setSelectedPokemon(data);
    setDrawerOpen(true);
  };

  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Pokemon Cards</Typography>
          <TextField
            label="Search Pokemon"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              label="Type"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {types.map((type) => (
                <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Limit"
            type="number"
            variant="outlined"
            fullWidth
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <Container>
            <Stack spacing={2} alignItems="center">
              {loading ? (
                <CircularProgress />
              ) : (
                <PaginationGrid handleLearnMoreClick={handleLearnMoreClick} pokemonList={filteredPokemonList} />
              )}
              {totalPokemonCount > limit && (
                <Pagination count={Math.ceil(totalPokemonCount / limit)} variant="outlined" shape="rounded" color="primary" onChange={(e, page) => setOffset((page - 1) * limit)} />
              )}
            </Stack>
          </Container>
        </Stack>
      </Container>
      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, padding: 2 }}>
          {selectedPokemon && (
            <>
              <Typography variant="h5">{selectedPokemon.name}</Typography>
              <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} style={{ width: '100%' }} />
              <Typography variant="body1">Height: {selectedPokemon.height}</Typography>
              <Typography variant="body1">Weight: {selectedPokemon.weight}</Typography>
              <Typography variant="body1">Base Experience: {selectedPokemon.base_experience}</Typography>
              <Typography variant="body1">Abilities:</Typography>
              <ul>
                {selectedPokemon.abilities.map((ability, index) => (
                  <li key={index}>{ability.ability.name}</li>
                ))}
              </ul>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
