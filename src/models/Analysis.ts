import { Document, Schema, model, Model } from 'mongoose';

export interface IBiasInstance {
    line: number;
    code: string;
    biasType: string;
    explanation: string;
    recommendation: string;
}

export interface IAnalysis {
    user: Schema.Types.ObjectId;
    text: string;
    url?: string;
    biasInstances: IBiasInstance[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IAnalysisMethods {
    addBiasInstance(biasInstance: IBiasInstance): Promise<void>;
}

export type IAnalysisModel = Model<IAnalysis, {}, IAnalysisMethods>;

const AnalysisSchema = new Schema<IAnalysis, IAnalysisModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    biasInstances: [{
        line: {
            type: Number,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        biasType: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        },
        recommendation: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Add methods
AnalysisSchema.methods.addBiasInstance = async function(biasInstance: IBiasInstance): Promise<void> {
    this.biasInstances.push(biasInstance);
    await this.save();
};

const Analysis = model<IAnalysis, IAnalysisModel>('Analysis', AnalysisSchema);
export default Analysis;
