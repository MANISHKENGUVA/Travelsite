<template>
  <div>
    <input
      type="file"
      multiple
      @change="handleFiles"
      accept="image/*,video/*,application/*"
    />
    <input type="submit" value="Upload" @click="uploadFiles" />


    {{ miss}}



    

    <div v-if="tempblobUrls.length">
      <h3>Selected Files:</h3>
      <ul>
        <li v-for="(url, index) in tempblobUrls" :key="index">
          {{ url }}
        </li>
      </ul>
    </div>

    <div v-if="tempblobUrls.length">
      <h3>Preview:</h3>
      <div v-for="(url, index) in tempblobUrls" :key="index" style="margin-bottom: 20px;">
        <!-- 🔍 Detect file type and show accordingly -->
        <img v-if="isImage(tempblobs[index])" :src="url" style="max-width: 200px;" />
        <video
          v-else-if="isVideo(tempblobs[index])"
          :src="url"
          controls
          style="max-width: 300px;"
        ></video>
        <a v-else :href="url" target="_blank">Download File {{ index + 1 }}</a>
        <p>Size: {{ tempblobs[index].size }} bytes | Type: {{ tempblobs[index].type }}</p>
      </div>
    </div>

 <p>------------------------------------------</p>
    <div v-if="usertempblobUrls.length">
      <h3>Selected Files:</h3>
      <ul>
        <li v-for="(url, index) in usertempblobUrls" :key="index">
          {{ url }}
        </li>
      </ul>
    </div>
    <div v-if="usertempblobUrls.length">
      <h3>Preview:</h3>
      <div v-for="(url, index) in usertempblobUrls" :key="index" style="margin-bottom: 20px;">
      
        <img v-if="isImage(usertempblobs[index])" :src="url" style="max-width: 200px;" />
        <video
          v-else-if="isVideo(usertempblobs[index])"
          :src="url"
          controls
          style="max-width: 300px;"
        ></video>
        <a v-else :href="url" target="_blank">Download File {{ index + 1 }}</a>
        <p>Size: {{ usertempblobs[index].size }} bytes | Type: {{ usertempblobs[index].type }}</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      blobs: [],
      blobUrls: [],
      tempblobs: [],
      tempblobUrls: [],
      usertempblobs: [],
      usertempblobUrls: [],
      siss:[],
      miss:[],
      allBlobs: [],
    };
  },
  created() {
     this.fetchAllBlobs();   
  },
  methods: {
    handleFiles(event) {
      const files = Array.from(event.target.files);

      // Convert files to Blobs and create preview URLs
      this.blobs = files.map(file => new Blob([file], { type: file.type }));
      this.blobUrls = this.blobs.map(blob => URL.createObjectURL(blob));
      this.tempblobs=[...this.tempblobs,...this.blobs];
      this.tempblobUrls=[...this.tempblobUrls,...this.blobUrls];
    },
    isImage(blob) {
      return blob.type.startsWith("image/");
    },
    isVideo(blob) {
      return blob.type.startsWith("video/");
    },
//    uploadFiles() {
//   alert("Uploading: " + JSON.stringify(this.tempblobs));
//   console.log(this.tempblobs);

//   let Datatosend = {
//     files: this.tempblobs, // <-- no JSON.stringify here
//     email: this.$store.getters.getUser.email,
//   };

//   const baseUrl = import.meta.env.VITE_API_BASE_URL;
//   fetch(`${baseUrl}photoStorage`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(Datatosend), // This is the correct place to stringify
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.error) {
//         console.error("Server error:", data.error);
//         alert("Error from server: " + data.error);
//         return;
//       }
//       console.log("Server response:", data);
//       this.blobUrls = [];
//       this.blobs = [];
//       this.tempblobs = [];
//       this.tempblobUrls = [];
//       alert("Files uploaded successfully!");
//     });
// },
//   async fetchAllBlobs() {
//   const baseUrl = import.meta.env.VITE_API_BASE_URL;

//   try {
//     const response = await fetch(`${baseUrl}photoStorage`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//     const data = await response.json();

//     if (data.error) {
//       console.error("Server error:", data.error);
//       alert("Error fetching blobs: " + data.error);
//       return;
//     }

//     console.log("All blobs from server:", data);
//     alert("All blobs from server:\n" + JSON.stringify(data, null, 2));
//     let allBlobs = [];

//         for (let i = 0; i < data.length; i++) {
//         if (Array.isArray(data[i].blob)) {
//             for (let j = 0; j < data[i].blob.length; j++) {
//             allBlobs.push(data[i].blob[j]);
//             }
//         }
//         }

//         this.usertemoblobs = allBlobs.map(file => new Blob([file], { type: file.type }));
//       this.usertempblobUrls = allBlobs.map(blob => URL.createObjectURL(blob));

//     // Now you can use data in your component
//   } catch (err) {
//     console.error("Unexpected fetch error:", err);
//     alert("Something went wrong while fetching blobs.");
//   }
// }

async uploadFiles() {
  const email = this.$store.getters.getUser.email;

  const filesAsBase64 = await Promise.all(
    this.tempblobs.map(blob => this.blobToBase64(blob))
  );

  let payload = {
    email,
    files: filesAsBase64.map((base64, index) => ({
      base64,
      type: this.tempblobs[index].type,
      size: this.tempblobs[index].size,
    })),
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  fetch(`${baseUrl}photoStorage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Files uploaded successfully!");
      this.tempblobUrls = [];
      this.tempblobs = [];
    });
},

blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); 
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
},
//     async fetchAllBlobs() {
//   const baseUrl = import.meta.env.VITE_API_BASE_URL;

//   try {
//     const response = await fetch(`${baseUrl}photoStorage`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//     const data = await response.json();

//     if (data.error) {
//       console.error("Server error:", data.error);
//       alert("Error fetching blobs: " + data.error);
//       return;
//     }

//     console.log("All blobs from server (raw):", data);
//     this.siss=data;

//     // Flatten all blobs from all records
//     let allBlobs = [];
//     for (let i = 0; i < data.length; i++) {
//       if (Array.isArray(data[i].blob)) {
//         for (let j = 0; j < data[i].blob.length; j++) {
//           allBlobs.push(data[i].blob[j]);
//         }
//       }
//     }

//     console.log("Flattened allBlobs array:", allBlobs);

//     // Convert raw blob data to real Blobs
//     this.usertemoblobs = allBlobs.map(file => {
//       if (file && file.data && file.type) {
//         return new Blob([new Uint8Array(file.data)], { type: file.type });
//       } else {
//         console.warn("Skipping invalid blob entry:", file);
//         return null;
//       }
//     }).filter(blob => blob !== null); // remove nulls

//     // Create preview URLs from the blobs
//     this.usertempblobUrls = this.usertemoblobs.map(blob => URL.createObjectURL(blob));

//     // ✅ Done — now you can use this.usertempblobUrls in <img> tags or download links
//     alert("Fetched and converted blobs:\n" + JSON.stringify(this.usertempblobUrls, null, 2));

//   } catch (err) {
//     console.error("Unexpected fetch error:", err);
//     alert("Something went wrong while fetching blobs.");
//   }
// }

async fetchAllBlobs() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}photoStorage`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    this.miss = data;

    let allBlobs = [];

    for (const record of data) {
      if (Array.isArray(record.blob)) {
        for (const file of record.blob) {
          if (file?.base64 && file?.type) {
            const blob = this.base64ToBlob(file.base64, file.type);
            allBlobs.push(blob);
          }
        }
      }
    }

   
    this.usertempblobs = allBlobs;
    this.usertempblobUrls = allBlobs.map(blob => URL.createObjectURL(blob));
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch blobs");
  }
},
base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
}


  },
  beforeDestroy() {
   
    this.blobUrls.forEach(url => URL.revokeObjectURL(url));
  }
};
</script>



