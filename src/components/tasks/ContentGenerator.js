import React, { useState } from 'react';
import { TextInput, Textarea, Button, Box, Title, Text, Paper, Slider, Group } from '@mantine/core';
import axios from 'axios';

function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/content`, {
        prompt,
        options: {
          temperature
        }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };
