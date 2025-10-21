import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Camera, Video, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function ProofGallery({ proofs }) {
  const [selectedProof, setSelectedProof] = useState(null);

  if (!proofs || proofs.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-white/80">
        <CardContent className="p-12 text-center">
          <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No delivery proofs uploaded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200/80 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Delivery Proofs ({proofs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedProof(proof)}
              >
                {proof.proof_type === "photo" ? (
                  <img
                    src={proof.file_url}
                    alt="Delivery proof"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Video className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                
                {proof.is_selected && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 border-yellow-600">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Best Quality
                  </Badge>
                )}
                
                {proof.quality_score && (
                  <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/90">
                    Score: {proof.quality_score}
                  </Badge>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProof} onOpenChange={() => setSelectedProof(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Delivery Proof</DialogTitle>
          </DialogHeader>
          {selectedProof && (
            <div className="space-y-4">
              {selectedProof.proof_type === "photo" ? (
                <img
                  src={selectedProof.file_url}
                  alt="Delivery proof"
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  src={selectedProof.file_url}
                  controls
                  className="w-full rounded-lg"
                />
              )}
              {selectedProof.upload_notes && (
                <p className="text-sm text-gray-600">{selectedProof.upload_notes}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}