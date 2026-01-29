declare module 'react-native-compass-heading' {
  interface CompassHeadingData {
    heading: number;
  }

  interface CompassHeading {
    start(
      degree_update_rate: number,
      callback: (data: CompassHeadingData) => void,
    ): void;
    stop(): void;
  }

  const CompassHeading: CompassHeading;
  export default CompassHeading;
}
