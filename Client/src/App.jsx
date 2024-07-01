import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack,
  Image,
  Link,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [image, updateImage] = useState();
  const [prompt, updatePrompt] = useState("");
  const [loading, updateLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (prompt) => {
    updateLoading(true);
    setError(null);

    try {
      const result = await axios.get(
        `http://127.0.0.1:8000/?prompt=${encodeURIComponent(prompt)}`
      );
      updateImage(result.data.image);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      updateLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image}`;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ChakraProvider>
      <Heading marginBottom={"50px"} marginTop={"16px"} marginLeft={"16px"}>
        Stable Diffusion🚀
      </Heading>
      <Container textAlign="center" marginLeft={"650px"}>
        <Text marginBottom={"50px"}>
          This React application leverages the model trained by Stability AI and
          Runway ML to generate images using the Stable Diffusion Deep Learning
          model. The model can be found via github here{" "}
          <Link href={"https://github.com/CompVis/stable-diffusion"}>
            Github Repo
          </Link>
        </Text>

        <Wrap justify="center" marginBottom={"50px"}>
          <Input
            value={prompt}
            onChange={(e) => updatePrompt(e.target.value)}
            width={"350px"}
          />
          <Button onClick={() => generate(prompt)} colorScheme={"yellow"}>
            Generate
          </Button>
        </Wrap>

        {loading ? (
          <Stack>
            <SkeletonCircle />
            <SkeletonText />
          </Stack>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : image ? (
          <>
            <Image
              src={`data:image/png;base64,${image}`}
              boxShadow="lg"
              marginTop={"16px"}
            />
            <Button onClick={downloadImage} colorScheme="green" mt={4}>
              Download
            </Button>
          </>
        ) : null}
      </Container>
    </ChakraProvider>
  );
};

export default App;
