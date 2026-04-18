import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [nivelSonido, setNivelSonido] = useState(0);
  const [progresoPoema, setProgresoPoema] = useState(0);

  const poema = [
    "Cuando todo calla",
    "empiezo a entenderme,",
    "necesito un lugar",
    "donde el ruido no entre,",
    "no hace falta gritar",
    "para lo que quiero expresar."
  ];

  useEffect(() => {
  let grabacion: Audio.Recording | null = null;
    const iniciarMicrofono = async () => {
      try {
        await Audio.requestPermissionsAsync();

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        grabacion = new Audio.Recording();

        await grabacion.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        grabacion.setOnRecordingStatusUpdate((estado) => {
          if (estado.metering !== undefined) {
            setNivelSonido(estado.metering);
          }
        });

        await grabacion.startAsync();
      } catch (error) {
        console.log(error);
      }
    };

    iniciarMicrofono();

    return () => {
      if (grabacion) {
        grabacion.stopAndUnloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (nivelSonido < -40) {
      setProgresoPoema((prev) => Math.min(prev + 0.02, 1));
    } else {
      setProgresoPoema((prev) => Math.max(prev - 0.05, 0));
    }
  }, [nivelSonido]);

  const lineasVisibles = Math.floor(progresoPoema * poema.length);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Busca un lugar silencioso</Text>
      {poema.slice(0, lineasVisibles).map((linea, index) => (
        <Text key={index} style={styles.poema}>
          {linea}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    color: "#cbd5f5",
    fontFamily: "serif",
    marginBottom: 30,
    textAlign: "center",
  },
  poema: {
    fontSize: 18,
    color: "#e2e8f0",
    fontFamily: "sans-serif-light",
    marginVertical: 5,
    textAlign: "center",
    lineHeight: 35,
  },
});