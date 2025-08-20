import { connectToDatabase } from './mongodb.js';

// Execute a find query
export async function executeFind(collection, query = {}, options = {}) {
  const db = await connectToDatabase();
  const result = await db.collection(collection).find(query, options).toArray();
  
  // Create a formatted string representation of the results
  let formattedResults = '';
  if (result.length > 0) {
    // Get all unique keys from all documents
    const allKeys = new Set();
    result.forEach(doc => {
      Object.keys(doc).forEach(key => allKeys.add(key));
    });
    
    // Format each document with all its properties
    formattedResults = result.map((doc, index) => {
      let docString = `Document ${index + 1}:\n`;
      for (const key of allKeys) {
        if (doc.hasOwnProperty(key)) {
          // Format the value based on its type
          let value = doc[key];
          if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
          }
          docString += `  ${key}: ${value}\n`;
        }
      }
      return docString;
    }).join('\n');

  } else {
    formattedResults = 'No documents found.';
  }
  
  console.log(`Found ${result.length} documents in ${formattedResults} collection`);

  

  return {
    content: [
      {
        type: "text",
        text: `Found ${result.length} documents in ${collection}  , collection:\n\n${formattedResults}`
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}




// Execute an total document as a query
export async function findAllcollections() {
  const db = await connectToDatabase();
  const collections = await db.listCollections().toArray();

  return {
    content: [
      {
        type: "text",
        text: `Total collections: ${collections.length} , and collections are :  ${collections.map(col => col.name)}`
      },
      {
        type: "text",
        text: JSON.stringify(collections, null, 2)

      }
    ]
  };
}



// Execute an insertOne query
export async function executeInsertOne(collection, document) {
  const db = await connectToDatabase();
  const result = await db.collection(collection).insertOne(document);
  return {
    content: [
      {
        type: "text",
        text: `Document inserted with ID: ${result.insertedId}`
      },
      {
        type: "text",
        text: JSON.stringify({ insertedId: result.insertedId }, null, 2)
      }
    ]
  };
}

// Execute an updateOne query
export async function executeUpdateOne(collection, filter, update) {
  const db = await connectToDatabase();
  const result = await db.collection(collection).updateOne(filter, update);
  return {
    content: [
      {
        type: "text",
        text: `Updated ${result.modifiedCount} document(s)`
      },
      {
        type: "text",
        text: JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, null, 2)
      }
    ]
  };
}

// Execute a deleteOne query
export async function executeDeleteOne(collection, filter) {
  const db = await connectToDatabase();
  const result = await db.collection(collection).deleteOne(filter);
  return {
    content: [
      {
        type: "text",
        text: `Deleted ${result.deletedCount} document(s)`
      },
      {
        type: "text",
        text: JSON.stringify({ deletedCount: result.deletedCount }, null, 2)
      }
    ]
  };
}


// Execute an aggregate query
export async function executeAggregate(collection, pipeline) {
  const db = await connectToDatabase();
  const result = await db.collection(collection).aggregate(pipeline).toArray();
  return {
    content: [
      {
        type: "text",
        text: `Aggregation returned ${result.length} document(s) in ${collection} collection , and result is : ${JSON.stringify(result, null, 2)}`
      },
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}