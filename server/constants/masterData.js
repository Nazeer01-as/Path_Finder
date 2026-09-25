/**
 * Indian Master Data Constants for PathFinder
 * Centralized lists for States, UTs, Education Levels, Streams, and Career Sectors.
 */

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

const ALL_STATES_AND_UTS = [
  'All India',
  ...INDIAN_STATES,
  ...UNION_TERRITORIES
];

const EDUCATION_LEVELS = [
  'Class 10',
  'Intermediate / 11th–12th',
  'Diploma / Polytechnic',
  'ITI',
  'Undergraduate',
  'Postgraduate',
  'Engineering',
  'Degree Student'
];

const STREAMS = [
  'Science (MPC / Physics, Chem, Math)',
  'Science (BiPC / Physics, Chem, Bio)',
  'Commerce',
  'Arts / Humanities',
  'Vocational',
  'General / Any Stream'
];

const CAREER_SECTORS = [
  'Engineering',
  'Medicine',
  'Computer Science',
  'Artificial Intelligence',
  'Government Jobs',
  'Defence',
  'Law',
  'Management',
  'Finance',
  'Design',
  'Agriculture',
  'Teaching',
  'Research',
  'Entrepreneurship',
  'Skilled Trades'
];

module.exports = {
  INDIAN_STATES,
  UNION_TERRITORIES,
  ALL_STATES_AND_UTS,
  EDUCATION_LEVELS,
  STREAMS,
  CAREER_SECTORS
};
