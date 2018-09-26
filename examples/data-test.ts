import { Serializable, SerializableInfo, NumberType, TextEncoding } from 'byte-serializer'
export class DataTest extends Serializable {

    @SerializableInfo.position(0)
    @SerializableInfo.numberType(NumberType.UInt32)
    public number: number;

    @SerializableInfo.position(4)
    @SerializableInfo.textEncoding(TextEncoding.ASCII)
    @SerializableInfo.length(10)
    public text: string;
}