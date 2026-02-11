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

export function getDepartmentsOptions() {
    const departments = async () => {
        const response = await axios.get('/system/config/departments');

        if (response.data.data && Array.isArray(response.data.data)) {
            const departments = response.data.data;
            const streamOptions = departments.map((stream: any) => ({
                value: stream.id,
                label: stream.name,
            }));
            return streamOptions;
        }
    };
    return departments;
}

;