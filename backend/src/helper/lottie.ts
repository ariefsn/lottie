import relottieMetadata, { type MetadataFileData } from '@lottiefiles/relottie-metadata';
import { type Metadata } from '@lottiefiles/relottie-metadata/metadata';
import relottieParse, { type ParseFileData } from '@lottiefiles/relottie-parse';
import relottieStringify, { type StringifyFileData } from '@lottiefiles/relottie-stringify';
import { unified } from 'unified';
export type TLottieFileData = ParseFileData & StringifyFileData & MetadataFileData

export const getLottieMetadata = async (lottie: string): Promise<Metadata & { name: string }> => {
  const vFile = unified()
    .use(relottieParse)
    .use(relottieMetadata)
    .use(relottieStringify)
    .processSync(lottie)

  const data = vFile.data as TLottieFileData

  const lottieObject = JSON.parse(lottie)

  return {
    ...data.metadata,
    name: lottieObject.nm
  }
}