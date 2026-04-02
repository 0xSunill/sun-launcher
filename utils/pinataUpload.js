

export const uploadToPinata = async (file, name, symbol, description) => {
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

  const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: 'POST',
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_PINATA_JWT,
      // Note: do NOT set Content-Type for FormData — browser sets it automatically with boundary
    },
    body: formData,
  });

  if (!imageRes.ok) throw new Error(`Pinata image upload failed: ${imageRes.statusText}`);
  const imageData = await imageRes.json();

  const imageCID = imageData.IpfsHash;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

  // Now upload metadata
  const metadataJSON = {
    name,
    symbol,
    description,
    image: imageURI,
    attributes: [],
  };

  const metaRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: 'POST',
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_PINATA_JWT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadataJSON),
  });

  if (!metaRes.ok) throw new Error(`Pinata metadata upload failed: ${metaRes.statusText}`);
  const metaData = await metaRes.json();

  const metadataCID = metaData.IpfsHash;
  const metadataURI = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;

  return metadataURI;
};
