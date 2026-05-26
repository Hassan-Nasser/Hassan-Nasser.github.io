const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'src/data/projects');

const rolesMap = {
  'void_rift.json': 'Senior Game Developer',
  'arena_rumble.json': 'Senior Game Developer',
  'forest_knight.json': 'Senior Game Developer',
  'millionaires_deal.json': 'Senior Game Developer',
  'virtual_market_metaverse.json': 'Senior Game Developer',
  'hyper_casual_games_collection.json': 'Senior Game Developer',
  'a_m_r_b.json': 'Junior Game Developer',
  'hlaf_anger.json': 'Junior Game Developer',
  'house_designer.json': 'Intermediate Game Developer',
  'in___out_ar_tour.json': 'Intermediate Game Developer'
};

Object.entries(rolesMap).forEach(([file, role]) => {
  const filePath = path.join(projectsDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.role = role;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${file} with role ${role}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
