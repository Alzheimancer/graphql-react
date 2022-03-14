const { useMutation, gql } = require("@apollo/client");
const UPLOAD_FILE = gql`
  mutation fileUpload($file: [Upload]!) {
    fileUpload(file: $file) {
      url
    }
  }
`;

const FileUpload = () => {
  const [fileUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => console.log(data),
  });
  const handleFileChange = (e) => {
    const file = e.target.files;
    if (!file) return;
    fileUpload({ variables: { file } });
  };
  return (
    <>
      <input
        type="file"
        name="GraphQLUploadForMedium"
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileUpload;
