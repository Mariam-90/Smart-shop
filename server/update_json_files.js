const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'json_files_directory');

const readJsonFilesAndUpdate = (directory) => {
    console.log(`Reading JSON files from directory: ${directory}`);
    const files = fs.readdirSync(directory);
    let updatedFiles = 0;

    files.forEach(file => {
        console.log(`Reading file: ${file}`);
        const filePath = path.join(directory, file);
        const data = fs.readFileSync(filePath, 'utf8');
        let json = JSON.parse(data);

        console.log(`Original JSON data: ${JSON.stringify(json, null, 2)}`);

        const updateItems = (items) => {
            items.forEach(item => {
                // Update 'category' to 'Category'
                if (item.category) {
                    item.Category = item.category;
                    delete item.category;
                }
                if (item.catagory) { // added check for typo 'catagory'
                    item.Category = item.catagory;
                    delete item.catagory;
                }
                // Update 'source' to 'Source'
                if (item.source) {
                    item.Source = item.source;
                    delete item.source;
                }
                // Remove 'ItemPrice' and add it back with '₪' symbol
                if (item.ItemPrice) {
                    const originalPrice = item.ItemPrice;
                    delete item.ItemPrice;
                    item.ItemPrice = `${originalPrice}₪`;
                }
                // Update 'image' to 'ImageUrl'
                if (item.image) {
                    item.ImageUrl = item.image;
                    delete item.image;
                }
            });
        };

        if (json.root && json.root.Items && json.root.Items.Item) {
            updateItems(json.root.Items.Item);
        } else if (Array.isArray(json)) {
            updateItems(json);
        }

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Updated JSON data: ${JSON.stringify(json, null, 2)}`);
        console.log(`Updated file: ${file}`);
        updatedFiles++;
    });

    console.log(`All files have been updated. Total updated files: ${updatedFiles}`);
};

readJsonFilesAndUpdate(directoryPath);
