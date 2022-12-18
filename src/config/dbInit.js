
  // fetch = async () => {
  //   const documents = (await getDocs(collection(db, 'projects'))).docs.map((doc) => doc.data());
  //   const json = new Blob([JSON.stringify(documents, null, 4)], { type: 'application/json' });
  //   console.log("sss",json);
  //   writeFileP(`/public/data.json`, "Hello World", (err, data) => {
  //     console.log(err || data);
  // });
  // fs.writeFile('/public/data.json', json, (err) => {
  //   if (err)
  //     console.log("Errorrr" + err);
  //   console.log("write sucessfully");
  // });
  // }
