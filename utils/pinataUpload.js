

import axios from 'axios';

export const uploadToPinata = async (file, name,symbol, description) => {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: name,
    symbol: symbol,
    keyvalues: {
      description: description
    }
  });

  formData.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 1
  });

  formData.append('pinataOptions', pinataOptions);

  const imageRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    maxContentLength: "Infinity",
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_PINATA_JWT,
      'Content-Type': 'multipart/form-data',
    },
  });

  const imageCID = imageRes.data.IpfsHash;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

  // Now upload metadata
  const metadataJSON = {
    name,
    symbol,
    description,
    image: imageURI,
    attributes: [],
  };

  const metaRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadataJSON, {
    headers: {
     Authorization: process.env.NEXT_PUBLIC_PINATA_JWT,
      'Content-Type': 'application/json',
    },
  });

  const metadataCID = metaRes.data.IpfsHash;
  const metadataURI = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;

  return metadataURI;
};
