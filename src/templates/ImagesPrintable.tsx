import { Photography } from "@/models/photography.model";
import { Page, Document, StyleSheet, View, Image, Text, Font } from "@react-pdf/renderer";
import marco from "../assets/Marco.png";

// Tamaño carta landscape: 792 x 612 puntos
// Padding: 20 puntos => área disponible: 752 x 572 puntos
// Gap deseado: 10 puntos
// Cada celda: ancho = (752 - 10)/2 = 371 puntos, altura = (572 - 10)/2 = 281 puntos
const CELL_WIDTH = 371;
const CELL_HEIGHT = 281;
const GAP = 10;

Font.register({
  family: "Oswald-regular",
  src: "http://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
  },
  // Cada fila contendrá 2 celdas con un gap horizontal de 10 puntos
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // separa las celdas dejando el gap horizontal
    marginBottom: GAP, // gap vertical entre filas
  },
  // La celda tiene tamaño fijo para asegurar el mismo gap en ambas direcciones
  cell: {
    position: "relative", // permite superponer el marco sobre la foto
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    padding: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  frame: {
    position: "absolute", // superposición del marco
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  code: {
    position: "absolute", // superposición del código
    top: 10,
    right: 0,
    fontSize: 10,
    fontFamily: "Oswald-regular",
    color: "#812710",
    textAlign: "center",
    width: 35,
  }
});

interface ImagesPrintableProps {
  photos: Photography[];
}

const ImagesPrintable = ({ photos }: ImagesPrintableProps) => {
  const pages = photos.length / 4;
  
  return (
    <Document>
      {[...Array(pages)].map((_, index) => (
        <Page size="LETTER" style={styles.page} orientation="landscape" key={index}>
          {/* Primera fila */}
          <View style={styles.row}>
            <View style={styles.cell}>
              <Image style={styles.photo} src={photos[index].url} />
              <Image style={styles.frame} src={marco} />
              <Text style={styles.code}>{photos[index].code}</Text>
            </View>
            <View style={styles.cell}>
              <Image style={styles.photo} src={photos[index+1].url} />
              <Image style={styles.frame} src={marco} />
              <Text style={styles.code}>{photos[index+1].code}</Text>

            </View>
          </View>
          {/* Segunda fila (quitamos el marginBottom extra en la última fila) */}
          <View style={[styles.row, { marginBottom: 0 }]}>
            <View style={styles.cell}>
              <Image style={styles.photo} src={photos[index+2].url} />
              <Image style={styles.frame} src={marco} />
              <Text style={styles.code}>{photos[index+2].code}</Text>

            </View>
            <View style={styles.cell}>
              <Image style={styles.photo} src={photos[index+3].url} />
              <Image style={styles.frame} src={marco} />
              <Text style={styles.code}>{photos[index+3].code}</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );

  // return (
  //   <Document>
  // <Page size="LETTER" style={styles.page} orientation="landscape">
  //   {/* Primera fila */}
  //   <View style={styles.row}>
  //     <View style={styles.cell}>
  //       <Image style={styles.photo} src="/ejemplo.jpg" />
  //       <Image style={styles.frame} src="/Marco.png" />
  //     </View>
  //     <View style={styles.cell}>
  //       <Image style={styles.photo} src="/ejemplo.jpg" />
  //       <Image style={styles.frame} src="/Marco.png" />
  //     </View>
  //   </View>
  //   {/* Segunda fila (quitamos el marginBottom extra en la última fila) */}
  //   <View style={[styles.row, { marginBottom: 0 }]}>
  //     <View style={styles.cell}>
  //       <Image style={styles.photo} src="/ejemplo.jpg" />
  //       <Image style={styles.frame} src="/Marco.png" />
  //     </View>
  //     <View style={styles.cell}>
  //       <Image style={styles.photo} src="/ejemplo.jpg" />
  //       <Image style={styles.frame} src="/Marco.png" />
  //     </View>
  //   </View>
  // </Page>
  //   </Document>
  // );
};

export default ImagesPrintable;
