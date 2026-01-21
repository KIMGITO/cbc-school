import axios from 'axios';

export function getStreamsOptions () {
  const streams = async () => {
         const response = await axios.get('/system/config/streams');

         if (response.data.data && Array.isArray(response.data.data)) {
             const streams = response.data.data;
             const streamOptions = streams.map((stream: any) => ({
                 value: stream.id,
                 label: stream.name,
             }));
             return (streamOptions);
         
         }
  };
    return streams;
}