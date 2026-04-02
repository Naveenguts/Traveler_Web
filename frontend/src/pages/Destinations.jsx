import React, { useState, useEffect, useMemo, useCallback } from 'react';
import '../styles/Destinations.css';
import DestinationCard from '../components/DestinationCard';
import { externalAPI } from '../services/externalApiService';
import { destinationAPI } from '../services/reviewService';

// Export destinations data so other components can use it
export const destinationsDataBase = [
  { id: 1, name: 'Paris', country: 'France', description: 'City of Lights', price: 2500, duration: 7, type: 'City', popularity: 95, date: '2024-01-15' },
  { id: 2, name: 'Tokyo', country: 'Japan', description: 'Land of the Rising Sun', price: 3200, duration: 10, type: 'City', popularity: 92, date: '2024-02-20' },
  { id: 3, name: 'New York', country: 'USA', description: 'The Big Apple', price: 2800, duration: 5, type: 'City', popularity: 88, date: '2024-03-10' },
  { id: 4, name: 'London', country: 'UK', description: 'The Capital of England', price: 2200, duration: 6, type: 'City', popularity: 90, date: '2024-04-05' },
  { id: 5, name: 'Dubai', country: 'UAE', description: 'City of Gold', price: 3500, duration: 8, type: 'City', popularity: 85, date: '2024-05-12' },
  { id: 6, name: 'Barcelona', country: 'Spain', description: 'City by the Sea', price: 1800, duration: 5, type: 'Beach', popularity: 87, date: '2024-06-18' },
  { id: 7, name: 'Rome', country: 'Italy', description: 'Eternal City', price: 2100, duration: 6, type: 'City', popularity: 93, date: '2024-07-10' },
  { id: 8, name: 'Amsterdam', country: 'Netherlands', description: 'City of Canals', price: 1900, duration: 4, type: 'City', popularity: 89, date: '2024-08-05' },
  { id: 9, name: 'Sydney', country: 'Australia', description: 'Harbor City', price: 3800, duration: 8, type: 'Beach', popularity: 91, date: '2024-09-20' },
  { id: 10, name: 'Bangkok', country: 'Thailand', description: 'City of Angels', price: 1500, duration: 5, type: 'City', popularity: 86, date: '2024-10-15' },
  { id: 11, name: 'Venice', country: 'Italy', description: 'City of Canals', price: 2300, duration: 5, type: 'City', popularity: 92, date: '2024-11-08' },
  { id: 12, name: 'Singapore', country: 'Singapore', description: 'Lion City', price: 2400, duration: 4, type: 'City', popularity: 84, date: '2024-12-01' },
  { id: 13, name: 'Berlin', country: 'Germany', description: 'City of Culture', price: 1700, duration: 4, type: 'City', popularity: 85, date: '2024-01-20' },
  { id: 14, name: 'Istanbul', country: 'Turkey', description: 'Bridge Between Continents', price: 1600, duration: 5, type: 'City', popularity: 87, date: '2024-02-10' },
  { id: 15, name: 'Montreal', country: 'Canada', description: 'Paris of North America', price: 2000, duration: 4, type: 'City', popularity: 80, date: '2024-03-05' },
  { id: 16, name: 'Vienna', country: 'Austria', description: 'City of Music', price: 2000, duration: 5, type: 'City', popularity: 88, date: '2024-04-12' },
  { id: 17, name: 'Prague', country: 'Czech Republic', description: 'City of 100 Spires', price: 1400, duration: 4, type: 'City', popularity: 89, date: '2024-05-08' },
  { id: 18, name: 'Budapest', country: 'Hungary', description: 'Pearl of the Danube', price: 1300, duration: 4, type: 'City', popularity: 87, date: '2024-06-14' },
  { id: 19, name: 'Madrid', country: 'Spain', description: 'City of Art', price: 1900, duration: 4, type: 'City', popularity: 86, date: '2024-07-20' },
  { id: 20, name: 'Athens', country: 'Greece', description: 'Ancient Wonder', price: 1500, duration: 4, type: 'City', popularity: 85, date: '2024-08-10' },
  { id: 21, name: 'Bali', country: 'Indonesia', description: 'Island Paradise', price: 1200, duration: 7, type: 'Beach', popularity: 91, date: '2024-09-05' },
  { id: 22, name: 'Ho Chi Minh City', country: 'Vietnam', description: 'Saigon Spirit', price: 900, duration: 5, type: 'City', popularity: 80, date: '2024-10-12' },
  { id: 23, name: 'Hanoi', country: 'Vietnam', description: 'Red River Capital', price: 800, duration: 5, type: 'City', popularity: 81, date: '2024-11-01' },
  { id: 24, name: 'Phuket', country: 'Thailand', description: 'Tropical Haven', price: 1100, duration: 6, type: 'Beach', popularity: 84, date: '2024-12-08' },
  { id: 25, name: 'Chiang Mai', country: 'Thailand', description: 'Rose of the North', price: 700, duration: 5, type: 'City', popularity: 82, date: '2024-01-25' },
  { id: 26, name: 'Krabi', country: 'Thailand', description: 'Limestone Cliffs', price: 950, duration: 5, type: 'Beach', popularity: 83, date: '2024-02-15' },
  { id: 27, name: 'Boracay', country: 'Philippines', description: 'White Sand Paradise', price: 1000, duration: 5, type: 'Beach', popularity: 85, date: '2024-03-20' },
  { id: 28, name: 'Manila', country: 'Philippines', description: 'Pearl of the Orient', price: 800, duration: 4, type: 'City', popularity: 79, date: '2024-04-10' },
  { id: 29, name: 'Kuala Lumpur', country: 'Malaysia', description: 'Twin Towers City', price: 1200, duration: 4, type: 'City', popularity: 82, date: '2024-05-18' },
  { id: 30, name: 'Penang', country: 'Malaysia', description: 'Pearl of the Orient', price: 800, duration: 4, type: 'City', popularity: 80, date: '2024-06-25' },
  { id: 31, name: 'Mumbai', country: 'India', description: 'Bollywood City', price: 1000, duration: 4, type: 'City', popularity: 81, date: '2024-07-30' },
  { id: 32, name: 'Delhi', country: 'India', description: 'Capital of Empires', price: 900, duration: 4, type: 'City', popularity: 79, date: '2024-08-22' },
  { id: 33, name: 'Jaipur', country: 'India', description: 'Pink City', price: 700, duration: 3, type: 'City', popularity: 80, date: '2024-09-14' },
  { id: 34, name: 'Agra', country: 'India', description: 'Taj Mahal City', price: 600, duration: 2, type: 'City', popularity: 90, date: '2024-10-05' },
  { id: 35, name: 'Goa', country: 'India', description: 'Beach Paradise', price: 800, duration: 5, type: 'Beach', popularity: 83, date: '2024-11-12' },
  { id: 36, name: 'Varanasi', country: 'India', description: 'Spiritual Heart', price: 500, duration: 3, type: 'City', popularity: 81, date: '2024-12-09' },
  { id: 37, name: 'Seoul', country: 'South Korea', description: 'Modern Metropolis', price: 1600, duration: 5, type: 'City', popularity: 86, date: '2024-01-28' },
  { id: 38, name: 'Busan', country: 'South Korea', description: 'Coastal Beauty', price: 1300, duration: 4, type: 'Beach', popularity: 82, date: '2024-02-18' },
  { id: 39, name: 'Jeju', country: 'South Korea', description: 'Island Paradise', price: 1200, duration: 4, type: 'Beach', popularity: 84, date: '2024-03-25' },
  { id: 40, name: 'Beijing', country: 'China', description: 'Forbidden City', price: 1500, duration: 5, type: 'City', popularity: 87, date: '2024-04-20' },
  { id: 41, name: 'Shanghai', country: 'China', description: 'Oriental Pearl', price: 1700, duration: 4, type: 'City', popularity: 85, date: '2024-05-28' },
  { id: 42, name: 'Xi\'an', country: 'China', description: 'Terracotta Army', price: 1000, duration: 3, type: 'City', popularity: 83, date: '2024-06-30' },
  { id: 43, name: 'Guilin', country: 'China', description: 'Karst Mountains', price: 1200, duration: 4, type: 'Nature', popularity: 86, date: '2024-07-26' },
  { id: 44, name: 'Hong Kong', country: 'China', description: 'Harbor City', price: 2000, duration: 4, type: 'City', popularity: 88, date: '2024-08-18' },
  { id: 45, name: 'Macau', country: 'China', description: 'Las Vegas of Asia', price: 1500, duration: 3, type: 'City', popularity: 79, date: '2024-09-22' },
  { id: 46, name: 'Moscow', country: 'Russia', description: 'Red Square Capital', price: 1800, duration: 5, type: 'City', popularity: 83, date: '2024-10-16' },
  { id: 47, name: 'St. Petersburg', country: 'Russia', description: 'Venice of the North', price: 1600, duration: 5, type: 'City', popularity: 84, date: '2024-11-20' },
  { id: 48, name: 'Lisbon', country: 'Portugal', description: 'City of 7 Hills', price: 1500, duration: 4, type: 'City', popularity: 85, date: '2024-12-15' },
  { id: 49, name: 'Porto', country: 'Portugal', description: 'Port Wine City', price: 1200, duration: 3, type: 'City', popularity: 82, date: '2024-01-30' },
  { id: 50, name: 'Marseille', country: 'France', description: 'Mediterranean Port', price: 1400, duration: 4, type: 'Beach', popularity: 81, date: '2024-02-25' },
  { id: 51, name: 'Lyon', country: 'France', description: 'Gastronomic Capital', price: 1300, duration: 3, type: 'City', popularity: 80, date: '2024-03-22' },
  { id: 52, name: 'Nice', country: 'France', description: 'French Riviera', price: 1600, duration: 4, type: 'Beach', popularity: 84, date: '2024-04-28' },
  { id: 53, name: 'Geneva', country: 'Switzerland', description: 'Peace City', price: 2500, duration: 4, type: 'City', popularity: 81, date: '2024-05-24' },
  { id: 54, name: 'Zurich', country: 'Switzerland', description: 'Financial Hub', price: 2400, duration: 4, type: 'City', popularity: 80, date: '2024-06-19' },
  { id: 55, name: 'Interlaken', country: 'Switzerland', description: 'Alpine Adventure', price: 2200, duration: 5, type: 'Nature', popularity: 87, date: '2024-07-27' },
  { id: 56, name: 'Lucerne', country: 'Switzerland', description: 'Alpine Gem', price: 2100, duration: 4, type: 'City', popularity: 84, date: '2024-08-31' },
  { id: 57, name: 'Valencia', country: 'Spain', description: 'City of Arts', price: 1500, duration: 4, type: 'Beach', popularity: 83, date: '2024-09-27' },
  { id: 58, name: 'Seville', country: 'Spain', description: 'Flamenco City', price: 1300, duration: 4, type: 'City', popularity: 82, date: '2024-10-24' },
  { id: 59, name: 'Granada', country: 'Spain', description: 'Alhambra Palace', price: 1100, duration: 3, type: 'City', popularity: 85, date: '2024-11-18' },
  { id: 60, name: 'Brussels', country: 'Belgium', description: 'Capital of Europe', price: 1400, duration: 3, type: 'City', popularity: 79, date: '2024-12-12' },
  { id: 61, name: 'Bruges', country: 'Belgium', description: 'Medieval Venice', price: 1200, duration: 2, type: 'City', popularity: 86, date: '2024-01-08' },
  { id: 62, name: 'Antwerp', country: 'Belgium', description: 'Diamond City', price: 1300, duration: 3, type: 'City', popularity: 78, date: '2024-02-03' },
  { id: 63, name: 'Copenhagen', country: 'Denmark', description: 'Little Mermaid City', price: 1800, duration: 4, type: 'City', popularity: 84, date: '2024-03-13' },
  { id: 64, name: 'Stockholm', country: 'Sweden', description: 'Venice of the North', price: 2000, duration: 4, type: 'City', popularity: 85, date: '2024-04-17' },
  { id: 65, name: 'Oslo', country: 'Norway', description: 'Viking City', price: 1900, duration: 4, type: 'City', popularity: 83, date: '2024-05-21' },
  { id: 66, name: 'Bergen', country: 'Norway', description: 'Gateway to Fjords', price: 1700, duration: 4, type: 'Nature', popularity: 86, date: '2024-06-28' },
  { id: 67, name: 'Helsinki', country: 'Finland', description: 'Baltic Beauty', price: 1600, duration: 4, type: 'City', popularity: 81, date: '2024-08-02' },
  { id: 68, name: 'Tallinn', country: 'Estonia', description: 'Medieval Old Town', price: 1000, duration: 3, type: 'City', popularity: 82, date: '2024-09-09' },
  { id: 69, name: 'Riga', country: 'Latvia', description: 'Art Nouveau Capital', price: 1000, duration: 3, type: 'City', popularity: 80, date: '2024-10-07' },
  { id: 70, name: 'Vilnius', country: 'Lithuania', description: 'Baroque Beauty', price: 900, duration: 3, type: 'City', popularity: 79, date: '2024-11-04' },
  { id: 71, name: 'Krakow', country: 'Poland', description: 'Historic Treasure', price: 1100, duration: 4, type: 'City', popularity: 84, date: '2024-12-02' },
  { id: 72, name: 'Warsaw', country: 'Poland', description: 'Phoenix City', price: 1200, duration: 4, type: 'City', popularity: 80, date: '2024-01-31' },
  { id: 73, name: 'Dubrovnik', country: 'Croatia', description: 'Pearl of the Adriatic', price: 1400, duration: 4, type: 'Beach', popularity: 88, date: '2024-02-28' },
  { id: 74, name: 'Split', country: 'Croatia', description: 'Roman Palace City', price: 1200, duration: 4, type: 'Beach', popularity: 85, date: '2024-03-27' },
  { id: 75, name: 'Zadar', country: 'Croatia', description: 'Dalmatian Gem', price: 900, duration: 3, type: 'Beach', popularity: 81, date: '2024-04-24' },
  { id: 76, name: 'Cairo', country: 'Egypt', description: 'Pyramids City', price: 1200, duration: 5, type: 'City', popularity: 89, date: '2024-05-22' },
  { id: 77, name: 'Alexandria', country: 'Egypt', description: 'Mediterranean Pearl', price: 1000, duration: 3, type: 'Beach', popularity: 80, date: '2024-06-26' },
  { id: 78, name: 'Marrakech', country: 'Morocco', description: 'Red City', price: 1100, duration: 4, type: 'City', popularity: 85, date: '2024-07-24' },
  { id: 79, name: 'Fez', country: 'Morocco', description: 'Medieval Medina', price: 800, duration: 3, type: 'City', popularity: 82, date: '2024-08-29' },
  { id: 80, name: 'Casablanca', country: 'Morocco', description: 'White City', price: 1000, duration: 3, type: 'City', popularity: 79, date: '2024-09-26' },
  { id: 81, name: 'Tangier', country: 'Morocco', description: 'Gateway City', price: 900, duration: 3, type: 'Beach', popularity: 78, date: '2024-10-23' },
  { id: 82, name: 'Cape Town', country: 'South Africa', description: 'Mother City', price: 1800, duration: 5, type: 'City', popularity: 87, date: '2024-11-27' },
  { id: 83, name: 'Johannesburg', country: 'South Africa', description: 'City of Gold', price: 1500, duration: 4, type: 'City', popularity: 79, date: '2024-12-25' },
  { id: 84, name: 'Los Angeles', country: 'USA', description: 'City of Angels', price: 2500, duration: 5, type: 'City', popularity: 84, date: '2024-01-12' },
  { id: 85, name: 'San Francisco', country: 'USA', description: 'Golden Gate City', price: 2400, duration: 4, type: 'City', popularity: 86, date: '2024-02-09' },
  { id: 86, name: 'Las Vegas', country: 'USA', description: 'Sin City', price: 1800, duration: 4, type: 'City', popularity: 81, date: '2024-03-08' },
  { id: 87, name: 'Miami', country: 'USA', description: 'Magic City', price: 2000, duration: 4, type: 'Beach', popularity: 83, date: '2024-04-15' },
  { id: 88, name: 'Boston', country: 'USA', description: 'Cradle of Liberty', price: 1900, duration: 4, type: 'City', popularity: 80, date: '2024-05-19' },
  { id: 89, name: 'Chicago', country: 'USA', description: 'Windy City', price: 1800, duration: 4, type: 'City', popularity: 82, date: '2024-06-23' },
  { id: 90, name: 'New Orleans', country: 'USA', description: 'Jazz City', price: 1500, duration: 4, type: 'City', popularity: 83, date: '2024-07-29' },
  { id: 91, name: 'Washington DC', country: 'USA', description: 'Capital City', price: 1600, duration: 3, type: 'City', popularity: 81, date: '2024-09-03' },
  { id: 92, name: 'Toronto', country: 'Canada', description: 'City of Diversity', price: 1900, duration: 4, type: 'City', popularity: 82, date: '2024-10-01' },
  { id: 93, name: 'Vancouver', country: 'Canada', description: 'Rainier City', price: 1700, duration: 4, type: 'City', popularity: 84, date: '2024-11-05' },
  { id: 94, name: 'Rio de Janeiro', country: 'Brazil', description: 'Marvelous City', price: 1800, duration: 5, type: 'Beach', popularity: 88, date: '2024-12-03' },
  { id: 95, name: 'São Paulo', country: 'Brazil', description: 'Brazilian Metropolis', price: 1600, duration: 4, type: 'City', popularity: 79, date: '2024-01-29' },
  { id: 96, name: 'Salvador', country: 'Brazil', description: 'Bahian Culture', price: 1200, duration: 4, type: 'Beach', popularity: 82, date: '2024-02-26' },
  { id: 97, name: 'Recife', country: 'Brazil', description: 'Venice of Brazil', price: 1100, duration: 4, type: 'Beach', popularity: 80, date: '2024-03-26' },
  { id: 98, name: 'Buenos Aires', country: 'Argentina', description: 'Paris of South America', price: 1500, duration: 5, type: 'City', popularity: 85, date: '2024-04-30' },
  { id: 99, name: 'Mendoza', country: 'Argentina', description: 'Wine Country', price: 1000, duration: 4, type: 'Nature', popularity: 81, date: '2024-06-04' },
  { id: 100, name: 'Lima', country: 'Peru', description: 'Culinary Capital', price: 1300, duration: 4, type: 'City', popularity: 83, date: '2024-07-02' },
  { id: 101, name: 'Cusco', country: 'Peru', description: 'Gateway to Machu Picchu', price: 1200, duration: 4, type: 'City', popularity: 86, date: '2024-08-06' },
  { id: 102, name: 'Machu Picchu', country: 'Peru', description: 'Lost City', price: 1500, duration: 3, type: 'Nature', popularity: 94, date: '2024-09-10' },
  { id: 103, name: 'Santiago', country: 'Chile', description: 'Capital of the Andes', price: 1400, duration: 4, type: 'City', popularity: 80, date: '2024-10-14' },
  { id: 104, name: 'Atacama', country: 'Chile', description: 'Driest Desert', price: 1600, duration: 4, type: 'Nature', popularity: 85, date: '2024-11-11' },
  { id: 105, name: 'Mexico City', country: 'Mexico', description: 'Ancient Capital', price: 1200, duration: 4, type: 'City', popularity: 84, date: '2024-12-10' },
  { id: 106, name: 'Cancun', country: 'Mexico', description: 'Caribbean Paradise', price: 1400, duration: 5, type: 'Beach', popularity: 85, date: '2024-01-09' },
  { id: 107, name: 'Playa del Carmen', country: 'Mexico', description: 'Caribbean Beach', price: 1300, duration: 5, type: 'Beach', popularity: 83, date: '2024-02-07' },
  { id: 108, name: 'Oaxaca', country: 'Mexico', description: 'Cultural Heart', price: 900, duration: 4, type: 'City', popularity: 81, date: '2024-03-14' },
  { id: 109, name: 'Cappadocia', country: 'Turkey', description: 'Fairy Chimneys', price: 1200, duration: 4, type: 'Nature', popularity: 87, date: '2024-04-11' },
  { id: 110, name: 'Antalya', country: 'Turkey', description: 'Turquoise Coast', price: 1100, duration: 4, type: 'Beach', popularity: 82, date: '2024-05-16' },
  { id: 111, name: 'Ephesus', country: 'Turkey', description: 'Ancient City', price: 1000, duration: 2, type: 'City', popularity: 84, date: '2024-06-20' },
  { id: 112, name: 'Amman', country: 'Jordan', description: 'City of the Seven Hills', price: 1000, duration: 4, type: 'City', popularity: 78, date: '2024-07-25' },
  { id: 113, name: 'Petra', country: 'Jordan', description: 'Rose-Red City', price: 1300, duration: 3, type: 'Nature', popularity: 91, date: '2024-08-28' },
  { id: 114, name: 'Dead Sea', country: 'Jordan', description: 'Lowest Point on Earth', price: 1100, duration: 2, type: 'Beach', popularity: 79, date: '2024-10-02' },
  { id: 115, name: 'Jerusalem', country: 'Israel', description: 'Holy City', price: 1400, duration: 4, type: 'City', popularity: 87, date: '2024-11-06' },
  { id: 116, name: 'Tel Aviv', country: 'Israel', description: 'Mediterranean Modern', price: 1600, duration: 4, type: 'Beach', popularity: 81, date: '2024-12-04' },
  { id: 117, name: 'Abu Dhabi', country: 'UAE', description: 'Oil Capital', price: 1800, duration: 4, type: 'City', popularity: 80, date: '2024-01-11' },
  { id: 118, name: 'Doha', country: 'Qatar', description: 'Modern Gulf City', price: 1700, duration: 4, type: 'City', popularity: 77, date: '2024-02-08' },
  { id: 119, name: 'Riyadh', country: 'Saudi Arabia', description: 'Modern Saudi Capital', price: 1600, duration: 4, type: 'City', popularity: 76, date: '2024-03-16' },
  { id: 120, name: 'Jeddah', country: 'Saudi Arabia', description: 'Gateway City', price: 1400, duration: 4, type: 'Beach', popularity: 75, date: '2024-04-19' },
  { id: 121, name: 'Maldives', country: 'Maldives', description: 'Island Paradise', price: 3500, duration: 6, type: 'Beach', popularity: 92, date: '2024-05-23' },
  { id: 122, name: 'Mauritius', country: 'Mauritius', description: 'Island Escape', price: 2500, duration: 6, type: 'Beach', popularity: 85, date: '2024-06-27' },
  { id: 123, name: 'Seychelles', country: 'Seychelles', description: 'Luxury Islands', price: 3200, duration: 6, type: 'Beach', popularity: 89, date: '2024-08-01' },
  { id: 124, name: 'Fiji', country: 'Fiji', description: 'Tropical Paradise', price: 2800, duration: 7, type: 'Beach', popularity: 86, date: '2024-09-04' },
  { id: 125, name: 'New Zealand', country: 'New Zealand', description: 'Adventure Land', price: 3000, duration: 8, type: 'Nature', popularity: 88, date: '2024-10-08' },
  { id: 126, name: 'Auckland', country: 'New Zealand', description: 'City of Sails', price: 2500, duration: 5, type: 'City', popularity: 83, date: '2024-11-09' },
  { id: 127, name: 'Christchurch', country: 'New Zealand', description: 'Garden City', price: 2300, duration: 5, type: 'City', popularity: 81, date: '2024-12-06' },
  { id: 128, name: 'Melbourne', country: 'Australia', description: 'Cultural Capital', price: 2500, duration: 5, type: 'City', popularity: 84, date: '2024-01-17' },
  { id: 129, name: 'Brisbane', country: 'Australia', description: 'Subtropical City', price: 2200, duration: 4, type: 'City', popularity: 80, date: '2024-02-14' },
  { id: 150, name: 'Perth', country: 'Australia', description: 'Swan River City', price: 2100, duration: 4, type: 'Beach', popularity: 79, date: '2024-03-19' },
];

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    priceRange: '',
    duration: '',
    type: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [destinationImages, setDestinationImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);
  const [destinationsData, setDestinationsData] = useState(destinationsDataBase);

  // Enrich static destination list with backend details (foods, restaurants, booking metadata)
  useEffect(() => {
    let isMounted = true;

    const hydrateDestinationsFromApi = async () => {
      try {
        const response = await destinationAPI.getAllDestinations();
        const apiDestinations = Array.isArray(response?.destinations) ? response.destinations : [];

        if (!apiDestinations.length || !isMounted) {
          return;
        }

        const byName = new Map(
          apiDestinations.map((item) => [String(item.name || '').toLowerCase(), item])
        );

        const merged = destinationsDataBase.map((baseDestination) => {
          const apiMatch = byName.get(baseDestination.name.toLowerCase());
          return apiMatch ? { ...baseDestination, ...apiMatch } : baseDestination;
        });

        setDestinationsData(merged);
      } catch (error) {
        // Keep static fallback list if API is unavailable.
        console.warn('Destination API enrichment skipped:', error.message);
      }
    };

    hydrateDestinationsFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce search term (800ms delay to reduce API calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resolve destination images once on mount using deterministic URLs.
  useEffect(() => {
    let isActive = true;
    const fetchDestinationImages = async () => {
      try {
        setLoadingImages(true);
        const fallbackMap = {};
        destinationsDataBase.forEach((dest) => {
          fallbackMap[dest.name] = externalAPI.getPhotoFallback(dest.name, 1200, 800);
        });

        if (isActive) {
          setDestinationImages(fallbackMap);
        }

        const imageEntries = await Promise.all(
          destinationsDataBase.map(async (dest) => {
            const imageUrl = await externalAPI.getCityImage(dest.name, 800);
            return [dest.name, imageUrl];
          })
        );

        if (isActive) {
          setDestinationImages(Object.fromEntries(imageEntries));
        }
      } catch (error) {
        console.error('Error fetching batch images:', error);
      } finally {
        if (isActive) {
          setLoadingImages(false);
        }
      }
    };

    fetchDestinationImages();
    return () => {
      isActive = false;
    };
  }, []);

  // Get unique values for filter options
  const countries = [...new Set(destinationsDataBase.map(dest => dest.country))].sort();
  const types = [...new Set(destinationsDataBase.map(dest => dest.type))].sort();

  // Apply filters and search
  let filteredDestinations = destinationsData.filter(dest => {
    // Search filter
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Country filter
    const matchesCountry = !filters.country || dest.country === filters.country;
    
    // Price range filter
    let matchesPrice = true;
    if (filters.priceRange) {
      const price = dest.price;
      switch (filters.priceRange) {
        case 'under2000':
          matchesPrice = price < 2000;
          break;
        case '2000-2500':
          matchesPrice = price >= 2000 && price <= 2500;
          break;
        case '2500-3000':
          matchesPrice = price >= 2500 && price <= 3000;
          break;
        case 'over3000':
          matchesPrice = price > 3000;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    // Duration filter
    let matchesDuration = true;
    if (filters.duration) {
      const duration = dest.duration;
      switch (filters.duration) {
        case 'short':
          matchesDuration = duration <= 5;
          break;
        case 'medium':
          matchesDuration = duration > 5 && duration <= 8;
          break;
        case 'long':
          matchesDuration = duration > 8;
          break;
        default:
          matchesDuration = true;
      }
    }
    
    // Type filter
    const matchesType = !filters.type || dest.type === filters.type;
    
    return matchesSearch && matchesCountry && matchesPrice && matchesDuration && matchesType;
  });

  // Apply sorting
  if (sortBy) {
    filteredDestinations = [...filteredDestinations].sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'popular':
          return b.popularity - a.popularity;
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      priceRange: '',
      duration: '',
      type: ''
    });
    setSortBy('');
    setSearchTerm('');
  };

  return (
    <div className="destinations">
      <div className="destinations-header">
        <h2>Travel Destinations</h2>
        <p className="destinations-subtitle">Explore amazing destinations around the world</p>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search destinations by name or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters and Sorting Section */}
      <div className="filters-section">
        <div className="filters-container">
          <h3 className="filters-title">Filters</h3>
          
          <div className="filter-group">
            <label htmlFor="country-filter">Country</label>
            <select
              id="country-filter"
              className="filter-select"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price-filter">Price Range</label>
            <select
              id="price-filter"
              className="filter-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="under2000">Under $2,000</option>
              <option value="2000-2500">$2,000 - $2,500</option>
              <option value="2500-3000">$2,500 - $3,000</option>
              <option value="over3000">Over $3,000</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="duration-filter">Duration</label>
            <select
              id="duration-filter"
              className="filter-select"
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">All Durations</option>
              <option value="short">Short (≤5 days)</option>
              <option value="medium">Medium (6-8 days)</option>
              <option value="long">Long (≥9 days)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>

        {/* Sorting Section */}
        <div className="sorting-container">
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Destination List */}
      <div className="destination-list">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((dest, index) => (
            <DestinationCard 
              key={dest.id} 
              destination={dest}
              index={index}
              imageUrl={destinationImages[dest.name] || dest.image || externalAPI.getPhotoFallback(dest.name, 1200, 800)}
            />
          ))
        ) : (
          <div className="no-results-card" role="status" aria-live="polite">
            <div className="no-results-icon" aria-hidden="true">🧭</div>
            <h4 className="no-results-title">No destinations match your filters</h4>
            <p className="no-results-text">Try broadening the search or clearing filters to discover more places.</p>
            <div className="no-results-actions">
              <button className="btn-primary" onClick={clearFilters}>Reset Filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;


